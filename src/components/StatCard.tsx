
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "rounded-xl p-6 transition-all duration-300 hover:shadow-md",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        glass: "glass-card backdrop-blur-md",
        filled: "bg-primary/10 text-foreground border border-primary/20",
        success: "bg-anomaly-low/10 text-foreground border border-anomaly-low/20",
        warning: "bg-anomaly-medium/10 text-foreground border border-anomaly-medium/20",
        danger: "bg-anomaly-high/10 text-foreground border border-anomaly-high/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface StatCardProps extends VariantProps<typeof cardVariants> {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

const StatCard = ({
  title,
  value,
  description,
  icon,
  footer,
  variant,
  className,
}: StatCardProps) => {
  return (
    <div className={cn(cardVariants({ variant }), className)}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-foreground/70">{title}</h3>
          <div className="mt-1 flex items-baseline">
            <p className="text-2xl font-semibold">{value}</p>
          </div>
          {description && (
            <p className="mt-1 text-sm text-foreground/60">{description}</p>
          )}
        </div>
        {icon && (
          <div className="p-2 rounded-lg bg-background/50">{icon}</div>
        )}
      </div>
      {footer && <div className="mt-4">{footer}</div>}
    </div>
  );
};

export default StatCard;
