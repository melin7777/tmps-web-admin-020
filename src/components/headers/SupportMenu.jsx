'use client';
import { useRouter } from 'next/navigation';
import { Button } from "@mui/material";

const SupportMenu = ({selected_root}) => {
  const router = useRouter();

  return (
    <div className='flex flex-row w-full justify-center items-center bg-zinc-100 gap-1 flex-wrap mb-2'>
      <Button variant='text' style={{textTransform: 'none'}} size='small' onClick={()=>router.push("/")}>Dashboard</Button>
      <Button variant='text' style={{textTransform: 'none', color: selected_root==='categories'?'#ffffff':'#27272a', backgroundColor: selected_root==='categories'?'#27272a':'#f4f4f5'}} size='small' onClick={()=>router.push("/categories")}>Categories</Button>
      <Button variant='text' style={{textTransform: 'none', color: selected_root==='sub-categories'?'#ffffff':'#27272a', backgroundColor: selected_root==='sub-categories'?'#27272a':'#f4f4f5'}} size='small' onClick={()=>router.push("/sub-categories")}>Sub Categories</Button>
      <Button variant='text' style={{textTransform: 'none', color: selected_root==='brands'?'#ffffff':'#27272a', backgroundColor: selected_root==='brands'?'#27272a':'#f4f4f5'}} size='small' onClick={()=>router.push("/brands")}>Brands</Button>
      <Button variant='text' style={{textTransform: 'none', color: selected_root==='models'?'#ffffff':'#27272a', backgroundColor: selected_root==='models'?'#27272a':'#f4f4f5'}} size='small' onClick={()=>router.push("/models")}>Models</Button>
      <Button variant='text' style={{textTransform: 'none', color: selected_root==='features'?'#ffffff':'#27272a', backgroundColor: selected_root==='features'?'#27272a':'#f4f4f5'}} size='small' onClick={()=>router.push("/features")}>Features</Button>
      <Button variant='text' style={{textTransform: 'none', color: selected_root==='inventory'?'#ffffff':'#27272a', backgroundColor: selected_root==='inventory'?'#27272a':'#f4f4f5'}} size='small' onClick={()=>router.push("/inventory")}>Inventory</Button>
      <Button variant='text' style={{textTransform: 'none', color: selected_root==='sellers'?'#ffffff':'#27272a', backgroundColor: selected_root==='sellers'?'#27272a':'#f4f4f5'}} size='small' onClick={()=>router.push("/sellers")}>Sellers</Button>
      <Button variant='text' style={{textTransform: 'none', color: selected_root==='customers'?'#ffffff':'#27272a', backgroundColor: selected_root==='customers'?'#27272a':'#f4f4f5'}} size='small' onClick={()=>router.push("/customers")}>Customers</Button>
      <Button variant='text' style={{textTransform: 'none', color: selected_root==='admins'?'#ffffff':'#27272a', backgroundColor: selected_root==='admins'?'#27272a':'#f4f4f5'}} size='small' onClick={()=>router.push("/admins")}>Admins</Button>
      <Button variant='text' style={{textTransform: 'none', color: selected_root==='slides'?'#ffffff':'#27272a', backgroundColor: selected_root==='slides'?'#27272a':'#f4f4f5'}} size='small' onClick={()=>router.push("/slides")}>Slides</Button>
      <Button variant='text' style={{textTransform: 'none', color: selected_root==='banners'?'#ffffff':'#27272a', backgroundColor: selected_root==='banners'?'#27272a':'#f4f4f5'}} size='small' onClick={()=>router.push("/banners")}>Banners</Button>
    </div>
  )
}

export default SupportMenu;