import clientPromise from "@/lib/mongodb";

export async function DELETE(request, {params}) {
    try {
        const client = await clientPromise;
        const db = client.db("nocode");
        const collection = db.collection("projects");
        const {pid} = params;
        const result = await collection.deleteOne(
            {_id: pid},
        );
        return new Response(JSON.stringify({messagei: "ok"}), {status: 201});
    } catch(error) {
        console.log(error);
        return new Response(JSON.stringify({messagei: "ng"}), {status: 500});
    }

}