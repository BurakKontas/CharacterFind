import React from "react";
import Head from 'next/head'

import { useAppDispatch, useAppSelector } from "@/Redux/hooks";
import Upload from "@/Components/Upload/Upload";

export default function Home() {
    return (
        <>
            <Head>
                <title>Character Find</title>
                <meta name="description" content="https.//characterfind.com" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <Upload />
            </main>
        </>
    )
}