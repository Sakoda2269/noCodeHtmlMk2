import clientPromise from "@/lib/mongodb";

export async function GET(request) {
    try {
        const client = await clientPromise;
        const db = client.db("nocode");
        const collection = db.collection("projects");
        console.log(request.url);
        const url = new URL(request.url);
        const pid = url.searchParams.get('pid');
        console.log(pid)
        let res = await collection.findOne({_id: pid});
        // let res = await collection.find({}).toArray();
        console.log(res)
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