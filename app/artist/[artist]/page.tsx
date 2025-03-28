import Image from "next/image"

/* 
    Spotify API artist endpoint return object
*/
interface Artist {
    id: string;
    name: string;
    images: Image[];
    external_urls: {spotify: string};
    followers: {total: number};
    genres: string[];
    popularity: number;
}
interface Image {
    width: number;
    height: number;
    url: string;
}
interface AlbumResponse {
    total: number;
    items: Album[];
}
interface Album {
    album_type: string;
    total_tracks: number;
    id: string;
    images: Image[];
    name: string;
    release_date: string;
    type: string;
    artists: Artist[];
}

/* 
    Spotify API Albums endpoint return objects
*/

interface DetailedAlbumResponse {
    albums: DetailedAlbum[];
}
interface DetailedAlbum {
    total_tracks: number;
    external_urls: {
        spotify: "string"
    },
    id: string;
    images: Image[];
    name: string;
    release_date: string;
    artists: Artist[];
    tracks: {
        total: number;
        items: Track[];
    }
}
interface Track {
    artists: Artist[];
    id: string;
    name: string;
    track_number: number;
}

export default async function Artist({
    params,
    }: {
    params: Promise<{ artist: string }>
  }) {

    /* Artist ID */
    const artistId = (await params).artist

    /* Spotify API Functions. */
    async function getToken(clientId: string | undefined, clientSecret: string | undefined): Promise<string | null> {

        if(clientId === undefined || clientId === undefined){
            return null;
        }

        /* Encode auth string into base 64. */
        const authString = `${clientId}:${clientSecret}`;
        const authBase64 = btoa(authString); // Works in both Node.js (with global `btoa`) and browser
    
        const url = "https://accounts.spotify.com/api/token";
    
        /* Add the authString to the request headers. */
        const headers = {
            'Authorization': `Basic ${authBase64}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        };
    
        /* Properly format the request body */
        const data = new URLSearchParams();
        data.append("grant_type", "client_credentials");
    
        /* Initiate token post request. */
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: headers,
                body: data.toString(), // Corrected encoding
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const jsonResult = await response.json();
            const token: string = jsonResult["access_token"];
            return token;
        } catch (error) {
            console.error("Error fetching token:", error);
            throw error; // Ensure caller knows an error occurred
        }
    }      
    async function getAuthHeaders(token: string): Promise<HeadersInit> {
        return {
            'Authorization': `Bearer ${token}`
        };
    }
    /* 
        Requests artist information from spotify API
        Input: Spotify API token (string), artist ID (string)
        Returns: Artist (Artist object)
    */
    async function getArtist(token: string, artistId: string): Promise<Artist> {

        const url = "https://api.spotify.com/v1/artists/" + artistId;
        const headers = await getAuthHeaders(token);

        const response = await fetch(`${url}`, { headers });
        if (!response.ok) {
            throw new Error(`Error fetching artist: ${response.statusText}`);
        }

        const jsonResult: Artist = await response.json();

        return jsonResult;
    }

    async function getAlbums(token: string, artistId: string): Promise<AlbumResponse>{

        const url = "https://api.spotify.com/v1/artists/" + artistId + "/albums";
        const headers = await getAuthHeaders(token);

        const response = await fetch(`${url}`, { headers });
        if (!response.ok) {
            throw new Error(`Error fetching artist: ${response.statusText}`);
        }

        const jsonResult: AlbumResponse = await response.json();

        return jsonResult;
    }

    /* Includes tracks. */
    async function getDetailedAlbums(token: string, albumIds: string[]): Promise<DetailedAlbumResponse> {

        let albumQuery = "";
        for (const albumId of albumIds.slice(0, 20)) { // Limit to 20 iterations
            albumQuery += albumId + ",";
        }
        albumQuery = albumQuery.slice(0, -1);

        const url = `https://api.spotify.com/v1/albums?ids=${albumQuery}`;

        const headers = await getAuthHeaders(token);

        const response = await fetch(`${url}`, { headers });
        if (!response.ok) {
            throw new Error(`Error fetching artist: ${response.statusText}`);
        }
        const jsonResult: DetailedAlbumResponse = await response.json();

        return jsonResult;
    }


    const artistLookup = async (artistId: string): Promise<Artist | undefined> => {
        
        const token: string | null = await getToken(process.env.SPOTIFY_CLIENT_ID, process.env.SPOTIFY_CLIENT_SECRET);

        if(!token) return;

        const artist: Artist = await getArtist(token, artistId);

        return artist;
    }

    const albumsLookup = async (artistId: string): Promise<Album[] | undefined> => {

        const token: string | null = await getToken(process.env.SPOTIFY_CLIENT_ID, process.env.SPOTIFY_CLIENT_SECRET);

        if(!token) return;

        const albums: AlbumResponse = await getAlbums(token, artistId);

        return albums.items;
    }

    const detailedAlbumsLookup = async (albumIds: string[]): Promise<DetailedAlbum[] | undefined> => {

        const token: string | null = await getToken(process.env.SPOTIFY_CLIENT_ID, process.env.SPOTIFY_CLIENT_SECRET);

        if(!token) return;

        const detailedAlbums: DetailedAlbumResponse = await getDetailedAlbums(token, albumIds);

        return detailedAlbums.albums;

    }

    const artist: Artist | undefined = await artistLookup(artistId);

    if(!artist) return;

    const albums: Album[] | undefined = await albumsLookup(artistId);

    if(!albums) return;

    const albumIds: string[] = [];
    for (const album of albums) {
        albumIds.push(album.id);
    }

    const detailedAlbums: DetailedAlbum[] | undefined = await detailedAlbumsLookup(albumIds);

    if(!detailedAlbums) return;

    return (
        <main className="page flex justify-center items-center flex-col">
            <div className="flex flex-row justify-between items-start rounded-md h-[17.5] flex justify-center">
                <section className="h-full pt-[0rem] flex flex-row min-w-[20rem]">
                    <div className="border-l-2 border-black opacity-20"></div>
                    <div className="ml-[1rem] pr-[5rem] pt-[1rem]">
                        <p
                            className="text-[2.5rem] font-bold break-words overflow-hidden 
                                    line-clamp-2 text-ellipsis max-w-full mb-[0.25rem] leading-[2.75rem]"
                            style={{
                                display: "-webkit-box",
                                WebkitBoxOrient: "vertical",
                                WebkitLineClamp: 2,
                                whiteSpace: "normal",
                            }}
                        >
                            {artist.name.length > 40 ? artist.name.slice(0, 40) + "..." : artist.name}
                        </p>
                        <p className="text-[1.15rem] font-semibold opacity-80 truncate max-w-[40ch] leading-[1.25rem]">
                            {artist.followers.total.toLocaleString() + " listeners"}
                        </p>
                        <p className="text-[0.85rem] uppercase font-semibold opacity-75 truncate max-w-[40ch]">
                            {artist.genres.slice(0, 3).join(", ")}
                        </p>
                    </div>
                </section>
                <div className="">
                    <figure className="w-[17.5rem] h-[17.5rem] z-10">
                        <Image
                        src={artist.images[0].url}
                        width={280} 
                        height={280}
                        alt={artist.name}
                        className="w-full h-full rounded-full shadow-xl object-cover"
                        />
                    </figure>
                </div>
            </div>
            <ul>
                Button
            </ul>
        </main>
    )
}