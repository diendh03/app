import { ChevronsUpDownIcon } from 'lucide-react-native';
import React from 'react';

import { Pressable, Text } from '@/components/ui';
import { Icon } from '@/components/ui/icon';
import {
  Menu,
  MenuItem,
  MenuItemLabel,
  MenuSeparator,
} from '@/components/ui/menu';

interface SelectOption {
  label: string;
  value: string;
  icon?: React.ElementType;
}

interface SingleSelectProps {
  data: SelectOption[];
  selectedValue?: string;
  defaultValue?: string;
  onSelect: (value: string) => void;
}

export function SingleSelect({
  data,
  selectedValue,
  defaultValue,
  onSelect,
}: SingleSelectProps) {
  const [selected, setSelected] = React.useState<string>(
    selectedValue || defaultValue || ''
  );

  const handleSelectionChange = (value: string) => {
    setSelected(value);
    onSelect(value);
  };

  return (
    <>
      <Menu
        placement="right top"
        selectionMode="single"
        selectedKeys={new Set([selected])}
        offset={5}
        className="p-1.5"
        onSelectionChange={(keys: any) => {
          const selectedKey = keys.currentKey;
          handleSelectionChange(selectedKey);
        }}
        closeOnSelect={true}
        trigger={({ ...triggerProps }) => {
          return (
            <Pressable
              {...triggerProps}
              className="flex-row items-center justify-between gap-x-2 rounded-full border border-background-500 p-2"
            >
              <Text className="font-semibold text-primary-500">
                {data.find((item) => item.value === selected)?.label || 'Menu'}
              </Text>

              <Icon as={ChevronsUpDownIcon} size="sm" className="mr-2" />
            </Pressable>
          );
        }}
      >
        {data.map((item) => (
          <MenuItem
            key={item.value}
            textValue={item.label}
            className={`p-2 ${item.value === selected ? 'bg-background-100' : ''}`}
          >
            {item.icon && <Icon as={item.icon} size="sm" className="mr-2" />}
            <MenuItemLabel size="sm">{item.label}</MenuItemLabel>
          </MenuItem>
        ))}
        <MenuSeparator />
      </Menu>
    </>
  );
}
