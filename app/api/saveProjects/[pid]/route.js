import clientPromise from "@/lib/mongodb";

export async function POST(request, {params}) {
    try {
        const client = await clientPromise;
        const db = client.db("nocode");
        const collection = db.collection("projects");
        const body = await request.json();
        const {pid} = params;
        const result = await collection.updateOne(
            {_id: pid},
            {$set: {...body}},
            {upsert: true}
        );
        return new Response(JSON.stringify({messagei: "ok"}), {status: 201});
    } catch(error) {
        console.log(error);
        return new Response(JSON.stringify({messagei: "ng"}), {status: 500});
    }

}