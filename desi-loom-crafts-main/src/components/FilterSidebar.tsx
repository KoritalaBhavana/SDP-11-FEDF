import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FilterState {
  categories: string[];
  priceRange: [number, number];
  isHandmade: boolean;
  rating: number;
}

interface FilterSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const categories = [
  'Sarees',
  'Dresses', 
  'Men\'s Kurtas',
  'Men\'s Shirts',
  'Kurtis',
  'Dupattas',
  'Bags',
  'Accessories'
];

const FilterSidebar = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters, 
  isOpen, 
  onClose 
}: FilterSidebarProps) => {
  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      onFiltersChange({
        ...filters,
        categories: [...filters.categories, category]
      });
    } else {
      onFiltersChange({
        ...filters,
        categories: filters.categories.filter(c => c !== category)
      });
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed md:sticky top-[var(--header-height)] md:top-[var(--header-height)] left-0 h-[calc(100vh-var(--header-height))] md:h-auto w-80 md:w-64 bg-card 
        border-r border-border z-40 transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        overflow-y-auto p-6 md:mt-6
      `}>
        <div className="flex items-center justify-between mb-6 md:hidden">
          <h3 className="text-lg font-semibold">Filters</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Categories */}
          <div>
            <h4 className="font-medium mb-4">Categories</h4>
            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={category}
                    checked={filters.categories.includes(category)}
                    onCheckedChange={(checked) => handleCategoryChange(category, !!checked)}
                  />
                  <Label 
                    htmlFor={category}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Price Range */}
          <div>
            <h4 className="font-medium mb-4">Price Range</h4>
            <div className="space-y-4">
              <Slider
                value={filters.priceRange}
                onValueChange={(value) => onFiltersChange({
                  ...filters,
                  priceRange: value as [number, number]
                })}
                min={0}
                max={50000}
                step={500}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>₹{filters.priceRange[0].toLocaleString()}</span>
                <span>₹{filters.priceRange[1].toLocaleString()}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Handmade Filter */}
          <div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="handmade"
                checked={filters.isHandmade}
                onCheckedChange={(checked) => onFiltersChange({
                  ...filters,
                  isHandmade: !!checked
                })}
              />
              <Label htmlFor="handmade" className="font-medium cursor-pointer">
                Handmade Only
              </Label>
            </div>
          </div>

          <Separator />

          {/* Rating Filter */}
          <div>
            <h4 className="font-medium mb-4">Minimum Rating</h4>
            <div className="space-y-2">
              {[4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <Checkbox
                    id={`rating-${rating}`}
                    checked={filters.rating >= rating}
                    onCheckedChange={(checked) => onFiltersChange({
                      ...filters,
                      rating: checked ? rating : 0
                    })}
                  />
                  <Label 
                    htmlFor={`rating-${rating}`}
                    className="flex items-center space-x-1 cursor-pointer"
                  >
                    <div className="flex">
                      {[...Array(rating)].map((_, i) => (
                        <span key={i} className="text-handloom-gold text-sm">★</span>
                      ))}
                    </div>
                    <span className="text-sm">& up</span>
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Clear Filters */}
          <Button 
            variant="outline" 
            onClick={onClearFilters}
            className="w-full"
          >
            Clear All Filters
          </Button>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;