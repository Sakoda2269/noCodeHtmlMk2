import clientPromise from "@/lib/mongodb";

export async function POST(request) {
    try {
        const client = await clientPromise;
        const db = client.db("nocode");
        const collection = db.collection("projects");
        const body = await request.json();
        let id = body.id;
        let other = body.other;
        const tmp = JSON.parse(JSON.stringify(other));
        console.log(tmp)
        const result = await collection.updateOne(
            {_id: id},
            {$set: {...tmp}},
            {upsert: true}
        );
        // const result = await collection.insertOne({
        //     _id: body.id,
        //     ...body.other
        // });
        return new Response(JSON.stringify({messagei: "ok"}), {status: 201});
    } catch(error) {
        console.log(error);
        return new Response(JSON.stringify({messagei: "ng"}), {status: 500});
    }

}