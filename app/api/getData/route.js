import clientPromise from "@/lib/mongodb";

export async function GET(request) {
    try {
        const client = await clientPromise;
        const db = client.db("nocode");
    } catch (error) {
        console.log(error);
    }
}