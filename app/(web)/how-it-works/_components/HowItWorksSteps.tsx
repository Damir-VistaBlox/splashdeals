import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/Icon";
interface Step {
  title: string;
  content: string;
  icon: string;
  color: string;
  bg: string;
}

interface HowItWorksStepsProps {
  steps: Step[];
}

export function HowItWorksSteps({ steps }: HowItWorksStepsProps) {
  return (
    <div className="mb-20 grid gap-8">
      {steps.map((step, idx) => (
        <div key={idx} className="transition-all duration-700">
          <Card className="border-border group relative flex flex-col items-start gap-8 overflow-hidden p-8 sm:flex-row sm:p-12">
            <div
              className={`rounded-2xl p-6 ${step.bg} ${step.color} shrink-0 transition-transform duration-500 group-hover:scale-110`}
            >
              <Icon name={step.icon} className="text-[40px]" />
            </div>

            <div className="space-y-4">
              <h2 className="text-foreground text-3xl font-black tracking-tight uppercase italic">
                {step.title}
              </h2>
              <p className="text-muted-foreground max-w-xl text-lg leading-relaxed">
                {step.content}
              </p>
            </div>

            {/* Background Decor */}
            <div
              className={`absolute -right-8 -bottom-8 h-32 w-32 rounded-full ${step.bg} opacity-20 blur-3xl`}
            />
          </Card>
        </div>
      ))}
    </div>
  );
}
