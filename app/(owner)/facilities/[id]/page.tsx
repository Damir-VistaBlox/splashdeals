import { getOwnerTicketPricesAction, getOwnerSalesAction } from "@/app/(server)/actions/owner";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { OwnerTicketPricesClient } from "./_components/owner-ticket-prices-client";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OwnerFacilityDashboardPage({ params }: Props) {
  const { id } = await params;

  let ticketPrices, sales;
  try {
    [ticketPrices, sales] = await Promise.all([
      getOwnerTicketPricesAction(id),
      getOwnerSalesAction(id),
    ]);
  } catch {
    notFound();
  }

  const totalRevenue = sales.reduce((sum, tx) => sum + Number(tx.totalAmount), 0);
  const totalTickets = sales.reduce((sum, tx) => sum + tx.issuedTickets.length, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Panel objekta</h1>
        <p className="text-muted-foreground text-sm">Upravljanje cenama ulaznica i pregled prodaje.</p>
      </div>

      {/* Sales summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ukupna zarada (30 dana)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Prodatih karata (30 dana)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalTickets}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Transakcija (30 dana)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{sales.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Ticket prices */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cene ulaznica</CardTitle>
        </CardHeader>
        <CardContent>
          <OwnerTicketPricesClient prices={ticketPrices} facilityId={id} />
        </CardContent>
      </Card>

      {/* Recent sales */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Poslednje transakcije</CardTitle>
        </CardHeader>
        <CardContent>
          {sales.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center text-sm">
              Nema transakcija u poslednjih 30 dana.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2 font-medium">Datum</th>
                    <th className="pb-2 font-medium">Iznos</th>
                    <th className="pb-2 font-medium">Karata</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map((tx) => (
                    <tr key={tx.id} className="border-b last:border-0">
                      <td className="py-2 text-muted-foreground">
                        {new Date(tx.createdAt).toLocaleDateString("sr-RS", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-2 font-medium">{formatCurrency(Number(tx.totalAmount))}</td>
                      <td className="py-2 text-muted-foreground">{tx.issuedTickets.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
