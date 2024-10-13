import clientPromise from "@/lib/mongodb";

export async function DELETE(request, {params}) {
    try {
        const client = await clientPromise;
        const db = client.db("nocode");
        const collection = db.collection("projects");
        const {pid, page} = params;
        const result = await collection.updateOne(
            {_id: pid},
            {$unset: {[`pages.${page}`]: ""}},
        );
        return new Response(JSON.stringify({messagei: "ok"}), {status: 201});
    } catch(error) {
        console.log(error);
        return new Response(JSON.stringify({messagei: "ng"}), {status: 500});
    }

}