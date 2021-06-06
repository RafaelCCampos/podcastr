export default function Home(props) {
  return (
    <div>
      <h1>Index</h1>
      <p>{JSON.stringify}</p>
    </div>
  )
}

export async function getStaticProps() {
  const response = await fetch('http://localhost:3333/episodes')
  const data = await response.json()

  return {
    props: {
      episodes: data,
    },
    revalidate: 60*60*8, //Refresh a cada 8 horas
  }
}