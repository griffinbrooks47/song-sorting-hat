
import Image from "next/image";

import { motion } from "motion/react";

import { useState } from "react";

interface Artist {
    id: string;
    name: string;
    images: Img[];
    external_urls: {spotify: string};
    followers: {total: number};
    genres: string[];
    popularity: number;
}
interface Img {
    width: number;
    height: number;
    url: string;
}

interface Track {
    artists: Artist[];
    id: string;
    name: string;
    track_number: number;
}
interface DetailedTrack {
    track: Track;
    cover: Img;
}

export const SongCard = (props: {track: DetailedTrack, onClick: (id: string, detailedTrack: DetailedTrack) => void }) => {

    const [isSelected, setIsSelected] = useState<boolean>(false);

    return (
        <motion.main className="relative h-[11rem] w-[11rem]"
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
        >
            <div 
                className={`relative card rounded-md w-[11rem] h-[100%] p-[0.5rem] cursor-pointer 
                    ${(isSelected) ? `bg-primary border-2 border-neutral` : `bg-base-100 border-2 border-neutral`}`}
            >
                <figure className="h-[100%] w-auto aspect-[1/1] rounded-md border-2 border-neutral">
                    <Image 
                        src={props.track.cover.url}
                        width={props.track.cover.width}
                        height={props.track.cover.height}
                        alt={props.track.track.name}
                        className="overflow-cover"
                    />
                </figure>
                <div className="m-auto flex justify-center items-center flex-col py-[0.25rem]">
                    <strong className="text-[0.9rem] font-bold block max-w-[14ch] truncate">
                        {props.track.track.name}
                    </strong>
                    <p className="text-[0.8rem] mt-[-0.25rem]">{props.track.track.artists[0].name}</p>
                </div>
            </div>
            {/* Opaque overlay */}
            <motion.div
                    className="absolute h-[100%] flex justify-center items-center inset-0 bg-black bg-opacity-90 rounded-md cursor-pointer"
                    initial={{ opacity: 0, backgroundColor: "black" }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.025 }}

                    onClick={() => {
                        props.onClick(props.track.track.id, props.track)
                        setIsSelected(!isSelected)
                    }}
                >
                    <div className="text-white flex items-center justify-center">
                        <p className="font-bold text-[1rem]">Add Song</p>
                    </div>
            </motion.div>
        </motion.main>
    )
}