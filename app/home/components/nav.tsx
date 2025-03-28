'use client'

import { IconWorld, IconUsers, IconUsersGroup, IconCirclePlus } from "@tabler/icons-react";

import { useState } from "react";

export default function Navbar() {

    const iconStyle = "h-[1.15rem]";

    /* Default page is global. */
    const [page, setPage] = useState<number>(0);

    const buttonStyle = "h-[2.5rem] px-[0.75rem] mx-[0.25rem] flex flex-row cursor-pointer justify-center items-center"

    return (
        <div className="flex flex-row justify-between">
            <ul className="bg-base-100 rounded-md flex flex-row py-[0.25rem] shadow-sm">
                <a className={`rounded-md ${page == 0 ? "bg-base-200" : ""} ${buttonStyle}`}
                    onClick={() => {
                        setPage(0);
                    }}
                >
                    <IconWorld className={`${iconStyle}`} />
                    <div className="font-semibold mx-[0.25rem]">Global</div>
                </a>
        

                <a className={`rounded-md ${page == 1 ? "bg-base-200" : ""} ${buttonStyle}`}
                    onClick={() => {
                        setPage(1);
                    }}
                >
                    <IconUsers className={`${iconStyle}`} />
                    <div className="font-semibold mx-[0.25rem]">Friends</div>
                </a>
            
    
                <div className={`rounded-md ${page == 2 ? "bg-base-200" : ""} ${buttonStyle}`}
                    onClick={() => {
                        setPage(2);
                    }}
                >
                    <IconUsersGroup className={`${iconStyle}`} />
                    <div className="font-semibold mx-[0.25rem]">Wiess</div>
                </div>
            </ul>
            <a className={`${buttonStyle} bg-accent rounded-md shadow-sm`}>
                <IconCirclePlus className="h-[1.25rem] w-[1.25rem]" />
                <div className="font-semibold mx-[0.25rem]">Create</div>
            </a>
        </div>
    )
}