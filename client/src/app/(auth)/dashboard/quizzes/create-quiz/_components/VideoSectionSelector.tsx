'use client';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/Form';
import { useFormContext } from 'react-hook-form';
import { useState } from 'react';

interface VideoSectionSelectorProps {
  videoSections: Array<{ videoSection: string; title: string; description: string }>;
  selectedCourse: boolean;
}

export const VideoSectionSelector = ({ videoSections, selectedCourse }: VideoSectionSelectorProps) => {
  const { control, setValue, watch } = useFormContext();
  const [isNewSection, setIsNewSection] = useState(false);
  const selectedSection = watch('videoSection');

  // Extract unique video sections
  const uniqueSections = Array.from(new Set(videoSections.map((section) => section.videoSection)));

  const handleSectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'new') {
      setIsNewSection(true);
      setValue('videoSection', ''); // Reset the value for new section input
    } else {
      setIsNewSection(false);
      setValue('videoSection', value);
    }
  };

  return (
    <FormField
      control={control}
      name="videoSection"
      render={({  }) => (
        <FormItem>
          <FormLabel>Video Section</FormLabel>
          <FormControl>
            <div className="space-y-2">
              <select
                className="w-full p-2 border rounded-md truncate"
                onChange={handleSectionChange}
                value={isNewSection ? 'new' : selectedSection}
                disabled={!selectedCourse}
              >
                <option value="">Select a video section</option>
                {uniqueSections.map((section) => (
                  <option key={section} value={section}>
                    {section}
                  </option>
                ))}
                {/* <option value="new">+ Create New Section</option> */}
              </select>

              {/* {isNewSection && (
                <Input
                  {...field}
                  placeholder="Enter new section name"
                  className="w-full p-2 border rounded-md"
                  disabled={!selectedCourse}
                />
              )} */}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};