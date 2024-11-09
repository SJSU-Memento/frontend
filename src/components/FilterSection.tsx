import { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Switch } from "@/components/ui/switch";

interface FilterSectionProps {
    label: string;
    content: ReactNode;
    filterBy: boolean;
    setFilterBy: (value: boolean) => void;
    className?: string;
}

export default function FilterSection({ className, label, content, filterBy, setFilterBy }: FilterSectionProps) {
    return (
        <div className={className}>
            <div className="flex items-center justify-between mb-2">
                <Label>{label}</Label>
                <Switch checked={filterBy} onClick={() => setFilterBy(!filterBy)} />
            </div>
            <Collapsible open={filterBy}>
                <CollapsibleContent>
                    <div className="border rounded-md p-4 bg-gray-100 relative">
                        {content}
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
}