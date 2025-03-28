
import Link from 'next/link'

import { IconSearch, IconUserCircle, IconSitemap } from "@tabler/icons-react";

import "./globals.css";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const isAuthenticated: boolean = true;

  return (
    <html lang="en" data-theme="cupcake" className='bg-base-200'>
      <body className="relative w-[100%] px-[0rem]">
        {children}
        <nav className="fixed top-0 px-[1.5rem] h-[4rem] w-full py-[0.5rem] bg-base-100 flex justify-between items-center z-1 shadow-sm">
          <div className='flex justify-center items-center ml-[1.5rem]'>
            <Link href="/home" className="mr-[1.5rem] pb-[1px] cursor-pointer font-semibold">
              Song Sorting Hat
            </Link>
            <Link href="/search" className="opacity-100 mx-[0.75rem]">
              <IconSearch className="h-[1.5rem] w-[1.5rem] pt-[2px]"/>
            </Link>
          </div>

          {isAuthenticated && 
            <div className='flex justify-center items-center'>
              <Link href='/search' className='mx-[1.25rem] cursor-pointer font-semibold flex'>
                <IconSitemap />
                <p className='mx-[0.5rem]'>My Sortings</p>
              </Link>
              <button className='ml-[0.5rem] mr-[0.5rem] h-full opacity-90'>
                <IconUserCircle className="pt-[0px]" height="2.5rem" width="2.5rem" />
              </button>
            </div>
          }
          {!isAuthenticated && 
            <div className='flex justify-center items-center'>
              <button className="btn btn-ghost mx-[0.5rem] rounded-md">
                Sign Up
              </button>
              <button className="btn btn-neutral rounded-md">
                Sign In
              </button>
            </div>
          }
        </nav>
      </body>
    </html>
  );
}
