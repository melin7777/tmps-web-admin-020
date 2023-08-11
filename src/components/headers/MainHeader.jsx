'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import {  signOut, useSession } from 'next-auth/react';
import { Avatar, CircularProgress, ClickAwayListener, Divider, Grow, IconButton, ListItemIcon, MenuItem, MenuList, Paper, Popper } from "@mui/material";
import { Dashboard, DirectionsCar, FileCopy, Inventory, Logout, Menu, Notifications, Person, Settings } from "@mui/icons-material";

const MainHeader = () => {
  const router = useRouter();
  const {data: session, status} = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [imageUrl, setImageUrl] = useState("none");
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  useEffect(() => {
    if(session && session.user){
      setIsAuthenticated(true);
      if(session.user.image==="none"){
        if(session.user.googleImage!==""){
          setImageUrl(session.user.googleImage);
        }
      }
      else{
        setImageUrl("https://tm-web.techmax.lk/"+session.user.image);
      }
    }
    else{
      setIsAuthenticated(false);
    }
  }, [session]);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  function handleListKeyDown(event){
    if(event.key==='Tab') {
      event.preventDefault();
      setOpen(false);
    } 
    else if(event.key==='Escape'){
      setOpen(false);
    }
  }

  const onSignOut = async () => {
    try {
      localStorage.removeItem('admin_inventory_search_data');
      localStorage.removeItem('admin_inventory_search_data');
      localStorage.removeItem('admin_inventory_search_rpp');
      localStorage.removeItem('admin_inventory_search_nop');
      localStorage.removeItem('admin_inventory_search_page');
      localStorage.removeItem('admin_inventory_search_sort_by');
      localStorage.removeItem('admin_inventory_search_order');
      localStorage.removeItem('admin_inventory_search_description');
      localStorage.removeItem('admin_inventory_search_brand');
      localStorage.removeItem('admin_inventory_search_model');
      localStorage.removeItem('admin_inventory_search_category');
      localStorage.removeItem('admin_inventory_search_status');

      localStorage.removeItem('admin_orders_search_data');
      localStorage.removeItem('admin_orders_search_rpp');
      localStorage.removeItem('admin_orders_search_nop');
      localStorage.removeItem('admin_orders_search_page');
      localStorage.removeItem('admin_orders_search_sort_by');
      localStorage.removeItem('admin_orders_search_order');
      localStorage.removeItem('admin_orders_search_start_date');
      localStorage.removeItem('admin_orders_search_end_date');
      localStorage.removeItem('admin_orders_search_status');

      localStorage.removeItem('admin_deliveries_search_data');
      localStorage.removeItem('admin_deliveries_search_rpp');
      localStorage.removeItem('admin_deliveries_search_nop');
      localStorage.removeItem('admin_deliveries_search_page');
      localStorage.removeItem('admin_deliveries_search_sort_by');
      localStorage.removeItem('admin_deliveries_search_order');
      localStorage.removeItem('admin_deliveries_search_start_date');
      localStorage.removeItem('admin_deliveries_search_end_date');
      localStorage.removeItem('admin_deliveries_search_status');
    } 
    catch (e) {
      console.log("put storage error");
    }
    setIsLoading(true);
    signOut();
    setIsLoading(false);
  }

  return (
    <div className="flex flex-row justify-center items-center w-full fixed top-0 z-50">
      <div className="flex flex-row justify-between items-center w-full max-w-6xl bg-white" style={{borderBottom: "3px solid #27272a"}}>
        <div className='flex flex-row flex-1'>
          <div onClick={()=>router.push("/")} className='flex flex-row gap-1 px-2 h-[40px] justify-start items-center cursor-pointer'>
            <div className='w-[50px] h-[30px] relative'><Image src='/logo-small.png' alt='logo' fill sizes='50px' priority={true} style={{objectFit: 'contain'}}/></div>
            <p className='font-bold text-xl sm:text-2xl text-zinc-800 hidden xs:flex'>TeckMax.lk</p>
          </div>
        </div>
        {status==="loading" && 
          <div className="flex flex-row justify-center items-center px-2">
            <CircularProgress size={24}/>
          </div>
        }
        {status==="authenticated" && 
          <>
            <div className="flex flex-row justify-center items-center gap-1">
              <IconButton onClick={()=>router.push('/notifications')}><Notifications sx={{width: 22, height: 22, color: '#27272a'}}/></IconButton>
              <IconButton onClick={()=>router.push('/orders')}><FileCopy sx={{width: 22, height: 22, color: '#27272a'}}/></IconButton>
              <div className='flex flex-row justify-center items-center gap-2 cursor-pointer' onClick={()=>router.push('/profile')}>
                {imageUrl==="none"?<Person sx={{width: 30, height: 30, color: '#047857'}}/>:<Avatar src={imageUrl} sx={{width: 30, height: 30}}/>}
                <div className='flex-col justify-center items-start w-30 hidden md:flex'>
                  <span className='text-xs font-medium'>{session?.user.name}</span>
                  <span className='text-xs text-zinc-800'>{"Admin"}</span>
                </div>
              </div>
              <IconButton ref={anchorRef} onClick={handleToggle}><Menu sx={{width: 28, height: 28, color: '#27272a'}}/></IconButton>
            </div>
            <Popper
              open={open}
              anchorEl={anchorRef.current}
              placement="bottom-start"
              transition={true}
              disablePortal={true}
            >
              {({ TransitionProps, placement }) => (
                <Grow {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === 'bottom-start' ? 'left top' : 'left bottom',
                  }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={()=>setOpen(false)}>
                      <MenuList autoFocusItem={open} onKeyDown={handleListKeyDown} sx={{width: 220}}>
                        <div className='flex-col justify-center items-start px-4 py-2 bg-white flex md:hidden'>
                          <span className='text-sm'>{session.user.name}</span>
                          <span className='text-xs text-emerald-600'>{"Admin"}</span>
                        </div>
                        <Divider className='flex md:hidden'/>
                        <MenuItem
                          onClick={()=>{
                            setOpen(false);
                            router.push("/");
                          }}
                        >
                          <ListItemIcon><Dashboard sx={{width: 18, height: 18, color: '#27272a'}}/></ListItemIcon>
                          <span className='text-sm'>Dashboard</span>
                        </MenuItem>
                        <Divider/>
                        <MenuItem
                          onClick={()=>{
                            setOpen(false);
                            router.push("/inventory");
                          }}
                        >
                          <ListItemIcon><Inventory sx={{width: 18, height: 18, color: '#27272a'}}/></ListItemIcon>
                          <span className='text-sm'>Inventory</span>
                        </MenuItem>
                        <Divider/>
                        <MenuItem
                          onClick={()=>{
                            setOpen(false);
                            router.push("/notifications");
                          }}
                        >
                          <ListItemIcon><Notifications sx={{width: 18, height: 18, color: '#27272a'}}/></ListItemIcon>
                          <span className='text-sm'>Notifications</span>
                        </MenuItem>
                        <MenuItem
                          onClick={()=>{
                            setOpen(false);
                            router.push("/orders");
                          }}
                        >
                          <ListItemIcon><FileCopy sx={{width: 18, height: 18, color: '#27272a'}}/></ListItemIcon>
                          <span className='text-sm'>Orders</span>
                        </MenuItem>
                        <MenuItem
                          onClick={()=>{
                            setOpen(false);
                            router.push("/deliveries");
                          }}
                        >
                          <ListItemIcon><DirectionsCar sx={{width: 18, height: 18, color: '#27272a'}}/></ListItemIcon>
                          <span className='text-sm'>Deliveries</span>
                        </MenuItem>
                        <Divider />
                        <MenuItem
                          onClick={()=>{
                            setOpen(false);
                            router.push("/profile");
                          }}
                        >
                          <ListItemIcon><Person sx={{width: 18, height: 18, color: '#27272a'}}/></ListItemIcon>
                          <span className='text-sm'>Profile</span>
                        </MenuItem>
                        <MenuItem
                          onClick={()=>{
                            setOpen(false);
                            router.push("/settings");
                          }}
                        >
                          <ListItemIcon><Settings sx={{width: 18, height: 18, color: '#27272a'}}/></ListItemIcon>
                          <span className='text-sm'>Settings</span>
                        </MenuItem>
                        <Divider />
                        <MenuItem 
                          onClick={()=>{
                            setOpen(false);
                            onSignOut();
                          }}
                        >
                          <ListItemIcon>{isLoading?<CircularProgress size={18} style={{'color': '#27272a'}}/>:<Logout sx={{width: 18, height: 18, color: '#27272a'}}/>}</ListItemIcon>
                          <span className='text-sm'>Sign Out</span>
                        </MenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </>
        }
      </div>
    </div>
  )
}

export default MainHeader;