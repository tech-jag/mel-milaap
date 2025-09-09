import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Edit, Save, X } from "lucide-react";
import { useOnboardingState } from "@/hooks/useOnboardingState";
import { useToast } from "@/hooks/use-toast";

interface EditableProfileSectionProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  data: any;
  fields: Array<{
    key: string;
    label: string;
    type: 'text' | 'number' | 'select' | 'textarea' | 'multi-select' | 'date';
    options?: string[];
    placeholder?: string;
  }>;
  onSave: (data: any) => Promise<void>;
}

export const EditableProfileSection: React.FC<EditableProfileSectionProps> = ({
  title,
  icon: Icon,
  data,
  fields,
  onSave
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(data);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleEdit = () => {
    setEditData(data);
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(editData);
      setIsEditing(false);
      toast({
        title: "Success",
        description: `${title} updated successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    }
    setIsSaving(false);
  };

  const handleCancel = () => {
    setEditData(data);
    setIsEditing(false);
  };

  const renderField = (field: any) => {
    const value = editData[field.key] || '';

    switch (field.type) {
      case 'select':
        return (
          <Select value={value} onValueChange={(val) => setEditData({...editData, [field.key]: val})}>
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'textarea':
        return (
          <Textarea
            value={value}
            onChange={(e) => setEditData({...editData, [field.key]: e.target.value})}
            placeholder={field.placeholder}
          />
        );
      case 'multi-select':
        return (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {Array.isArray(value) && value.map((item, index) => (
                <Badge key={index} variant="outline" className="cursor-pointer" 
                  onClick={() => {
                    const newArray = value.filter((_, i) => i !== index);
                    setEditData({...editData, [field.key]: newArray});
                  }}>
                  {item} <X className="w-3 h-3 ml-1" />
                </Badge>
              ))}
            </div>
            <Select onValueChange={(val) => {
              const currentArray = Array.isArray(value) ? value : [];
              if (!currentArray.includes(val)) {
                setEditData({...editData, [field.key]: [...currentArray, val]});
              }
            }}>
              <SelectTrigger>
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      default:
        return (
          <Input
            type={field.type}
            value={value}
            onChange={(e) => setEditData({...editData, [field.key]: e.target.value})}
            placeholder={field.placeholder}
          />
        );
    }
  };

  const renderDisplayValue = (field: any) => {
    const value = data[field.key];
    
    if (!value) return 'Not specified';
    
    if (Array.isArray(value)) {
      return value.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {value.map((item, index) => (
            <Badge key={index} variant="outline">{item}</Badge>
          ))}
        </div>
      ) : 'Not specified';
    }
    
    return value.toString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            {title}
          </div>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <X className="w-4 h-4" />
              </Button>
              <Button size="sm" onClick={handleSave} disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field, index) => (
              <div key={field.key} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                <Label className="text-sm font-medium text-muted-foreground">{field.label}</Label>
                {renderField(field)}
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field, index) => (
              <div key={field.key} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                <Label className="text-sm font-medium text-muted-foreground">{field.label}</Label>
                <div className="font-medium mt-1">{renderDisplayValue(field)}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};