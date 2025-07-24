import * as React from 'react';
import Chip from '@mui/material/Chip';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';

import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import DoneIcon from '@mui/icons-material/Done';
import {
  GridEditModes,
  useGridApiContext,
  useGridRootProps,
} from '@mui/x-data-grid';

export const STATUS_OPTIONS = ['Pending', 'Approved', 'Rejected'];

const StyledChip = styled(Chip)(({ theme }) => ({
  justifyContent: 'left',
  '& .icon': {
    color: 'inherit',
  },
  '&.Pending': {
    color: '#ffffff',
    backgroundColor: '#ed6c02', // Orange background like in the image
    border: '1px solid #ed6c02',
  },
  '&.Approved': {
    color: '#ffffff',
    backgroundColor: '#2e7d32', // Green background like in the image
  },
  '&.Rejected': {
    color: '#ffffff',
    backgroundColor: '#d32f2f', // Red background like in the image
    border: '1px solid #d32f2f',
  },
}));

const Status = React.memo((props) => {
  const { status } = props;

  let icon = null;
  if (status === 'Rejected') {
    icon = <CloseIcon className="icon" />;
  } else if (status === 'Pending') {
    icon = <AutorenewIcon className="icon" />;
  } else if (status === 'Approved') {
    icon = <DoneIcon className="icon" />;
  }

  let label = status;
  if (status === 'PartiallyFilled') {
    label = 'Partially Filled';
  }

  return (
    <StyledChip
      className={status}
      icon={icon}
      size="small"
      label={label}
    />
  );
});

Status.displayName = 'Status';

function EditStatus(props) {
  const { id, value, field } = props;
  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();

  const handleChange = async (event) => {
    const isValid = await apiRef.current.setEditCellValue({
      id,
      field,
      value: event.target.value,
    });

    if (isValid && rootProps.editMode === GridEditModes.Cell) {
      apiRef.current.stopCellEditMode({ id, field, cellToFocusAfter: 'below' });
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'backdropClick') {
      apiRef.current.stopCellEditMode({ id, field, ignoreModifications: true });
    }
  };

  return (
    <Select
      value={value}
      onChange={handleChange}
      MenuProps={{
        onClose: handleClose,
      }}
      sx={{
        height: '100%',
        '& .MuiSelect-select': {
          display: 'flex',
          alignItems: 'center',
          pl: 1,
        },
      }}
      autoFocus
      fullWidth
      open
    >
      {STATUS_OPTIONS.map((option) => {
        let IconComponent = null;
        if (option === 'Rejected') {
          IconComponent = CloseIcon;
        } else if (option === 'Pending') {
          IconComponent = AutorenewIcon;
        } else if (option === 'Approved') {
          IconComponent = DoneIcon;
        }

        let label = option;
        

        return (
          <MenuItem key={option} value={option}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <IconComponent fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={label} sx={{ overflow: 'hidden' }} />
          </MenuItem>
        );
      })}
    </Select>
  );
}

export function renderStatus(params) {
  if (params.value == null) {
    return '';
  }

  return <Status status={params.value} />;
}

export function renderEditStatus(params) {
  return <EditStatus {...params} />;
}
