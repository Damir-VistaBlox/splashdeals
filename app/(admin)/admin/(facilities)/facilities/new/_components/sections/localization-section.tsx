"use client"

import { Icon } from "@/components/ui/Icon";
 

import { useFormContext } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { FacilityFormValues } from "@/server/lib/validations/facility"

export function LocalizationSection() {
  const { control } = useFormContext<FacilityFormValues>()

  return (
    <Card className="border-white/5 bg-slate-900/50 backdrop-blur-md overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-white/5">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon name="location_on" className="text-[20px] text-primary" />
          Localization
        </CardTitle>
        <CardDescription>
          The structured physical address for Google Maps ingestion.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 grid grid-cols-2 gap-6">
        <FormField
          control={control}
          name="city"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder="Bački Petrovac" className="h-11 bg-white/5 border-white/10" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="postalCode"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel>Postal Code</FormLabel>
              <FormControl>
                <Input placeholder="21470" className="h-11 bg-white/5 border-white/10" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="streetName"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Street Name</FormLabel>
              <FormControl>
                <Input placeholder="Novosadski put" className="h-11 bg-white/5 border-white/10" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="streetNumber"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Number / Entrance</FormLabel>
              <FormControl>
                <Input placeholder="bb" className="h-11 bg-white/5 border-white/10" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}
