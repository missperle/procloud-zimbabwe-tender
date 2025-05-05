
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { X, Check, ChevronsUpDown } from "lucide-react";

interface SkillsSelectorProps {
  selectedSkills: string[];
  setSelectedSkills: (skills: string[]) => void;
  maxSkills?: number;
}

const SkillsSelector = ({ 
  selectedSkills, 
  setSelectedSkills,
  maxSkills = 10
}: SkillsSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [skills, setSkills] = useState<{name: string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('skills')
          .select('name')
          .order('name');

        if (error) throw error;
        
        if (data) {
          setSkills(data);
        }
      } catch (error) {
        console.error('Error fetching skills:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const toggleSkill = (skill: string) => {
    setSelectedSkills(
      selectedSkills.includes(skill)
        ? selectedSkills.filter((s) => s !== skill)
        : selectedSkills.length < maxSkills
          ? [...selectedSkills, skill]
          : selectedSkills
    );
  };

  const removeSkill = (skill: string) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skill));
  };

  return (
    <div className="space-y-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={selectedSkills.length >= maxSkills}
          >
            {selectedSkills.length < maxSkills ? "Select skills" : `Maximum ${maxSkills} skills selected`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search skills..." />
            <CommandEmpty>No skill found.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-y-auto">
              {skills.map((skill) => (
                <CommandItem
                  key={skill.name}
                  value={skill.name}
                  onSelect={() => {
                    toggleSkill(skill.name);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      selectedSkills.includes(skill.name) ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  {skill.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedSkills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedSkills.map((skill) => (
            <Badge key={skill} variant="secondary" className="pl-2 pr-1 py-1">
              {skill}
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 ml-1"
                onClick={() => removeSkill(skill)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
      
      <p className="text-xs text-muted-foreground">
        {selectedSkills.length} of {maxSkills} skills selected
      </p>
    </div>
  );
};

export default SkillsSelector;
