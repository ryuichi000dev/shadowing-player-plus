import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import LoopIcon from '@mui/icons-material/Loop';
import { Link } from '@mui/material';


function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };


  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <LoopIcon sx={{ display: { md: 'flex' }, mr: 1.3, fontSize: {xs: "large"} }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="https://github.com/ryuichi000dev/shadowing-player-plus"
            sx={{
              mr: 2,
              display: { md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              fontSize: { xs: '14px', sm: '20px'},
              letterSpacing: { xs: '.1rem', sm: '.2rem'},
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Shadowing Player Plus
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', sm: 'none' }, justifyContent: "end" }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
                <MenuItem key="guide"  onClick={handleCloseNavMenu}>
                  <Link textAlign="center" href="https://github.com/ryuichi000dev/shadowing-player-plus" underline="none" rel="noopener">GUIDE</Link>
                </MenuItem>
                <MenuItem key="contact" onClick={handleCloseNavMenu}>
                  <Link href="https://docs.google.com/forms/d/e/1FAIpQLSemLQM2k4yI9ja_9tRce6_lBViPnTQas2907gRlWh5zipHKHA/viewform?usp=sf_link" underline="none">CONTACT</Link>
                </MenuItem>
            </Menu>
          </Box>
          
          
          <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' }, justifyContent: "end" }}>
              <Button
                key="guide"
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
                href="https://github.com/ryuichi000dev/shadowing-player-plus"
              >
                GUIDE
              </Button>
              <Button
                key="contact"
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
                href="https://docs.google.com/forms/d/e/1FAIpQLSemLQM2k4yI9ja_9tRce6_lBViPnTQas2907gRlWh5zipHKHA/viewform?usp=sf_link"
              >
                CONTACT
              </Button>
          </Box>

        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;