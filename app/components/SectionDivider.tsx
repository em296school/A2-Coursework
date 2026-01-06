import { Box, Divider } from '@mantine/core';
import SectionDividerProps from '../types/SectionDividerProps';

export default function SectionDivider(props: SectionDividerProps) {
    return (
        <Divider
            pb="xs"
            labelPosition="left"
            label={
              <>
                {props.icon}
                <Box ml={5}>{props.children}</Box>
              </>
            }
            style={{
              borderBottom: '1px solid var(--mantine-color-default-border)',
            }}
          />
    )
}