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
    <div className="grid gap-8 mb-20">
      {steps.map((step, idx) => (
        <div
          key={idx}
          className="transition-all duration-700"
        >
          <Card className="p-8 sm:p-12 border-border flex flex-col sm:flex-row gap-8 items-start relative overflow-hidden group">
            <div className={`p-6 rounded-2xl ${step.bg} ${step.color} shrink-0 group-hover:scale-110 transition-transform duration-500`}>
              <Icon name={step.icon} className="text-[40px]" />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-3xl font-black uppercase italic tracking-tight text-foreground">
                {step.title}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                {step.content}
              </p>
            </div>

            {/* Background Decor */}
            <div className={`absolute -right-8 -bottom-8 h-32 w-32 rounded-full ${step.bg} blur-3xl opacity-20`} />
          </Card>
        </div>
      ))}
    </div>
  );
}
