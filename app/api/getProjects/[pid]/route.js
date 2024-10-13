import clientPromise from "@/lib/mongodb";

export async function GET(request, {params}) {
    try {
        const client = await clientPromise;
        const db = client.db("nocode");
        const collection = db.collection("projects");
        const {pid} = params;
        let res = await collection.findOne({_id: pid});
        return new Response(JSON.stringify(res), {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
            },
          });
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({message: "error"}), {status: 500});
    }
}