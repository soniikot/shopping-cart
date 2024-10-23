import { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setGender } from '@/features/filter/filterSlice';
import { type MouseEvent } from 'react';

export function BurgerMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleGenderChange = (gender: string) => {
    navigate('/products/');
    dispatch(setGender(gender));
  };

  return (
    <div>
      <Button
        size="large"
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        Menu
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        color="secondary"
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleClose}>
          <Link to="/products">Shop</Link>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleGenderChange('men');
            handleClose();
          }}
        >
          <li>Men</li>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleGenderChange('women');
            handleClose();
          }}
        >
          <li>Women</li>
        </MenuItem>
      </Menu>
    </div>
  );
}
