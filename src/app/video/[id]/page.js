import VideoPlayer from "@/components/VideoPlayer";

const url = "http://192.168.4.90:30010/api/v1/";

const getDataVideoByID = async (id) => {
  try {
    var myHeaders = new Headers();
    myHeaders.append("accept", "application/json");
    myHeaders.append("Authorization", "Bearer yUqEioYBzV7JWOHVQP.p.d3KRgELr5OMdhYBTNNFZzIkZBhP1FSFWqd5WhotkAeR");

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
    const res = await fetch(`${url}/video/${id}`, requestOptions)
    // console.log("res", await res.json());
    return await res.json()

  } catch (error) {
    console.log("error", error);

    return {}
  }

}


export default async function Home({ params }) {

  const data = await getDataVideoByID(params.id)
  console.log("params", params.id);
  console.log("data", data);

  return (
    <div className="bg-black">
      <VideoPlayer data={{ ...data }} />
    </div>
  )
}
