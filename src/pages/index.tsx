import { GetStaticProps } from 'next';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR'
import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';

import styles from './home.module.scss';

type Episode = {
  id: string;
  title: string;
  members: string;
  publishedAt: string;
  thumbnail: string;
  description: string;
  duration: number;
  durationAsString: string;
  url: string;
}

type HomeProps = {
  allEpisodes: Episode[];
  latestEpisodes: Episode[];
}

export default function Home({allEpisodes, latestEpisodes}: HomeProps) {
  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>

        <ul>
          {latestEpisodes.map(episode => {
            return (
              <li key={episode.id}>
                <Image 
                  src={episode.thumbnail}
                  alt={episode.title}
                  width={192}
                  height={192}
                  objectFit="cover"
                />
                
                <div className={styles.episodeDetails}>
                  <a href="">{episode.title}</a>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button type="button">
                  <img src="/play-green.svg" alt="Tocar episódio"/>
                </button>
              </li>
            )
          })}
        </ul>

      </section>
      <section className={styles.allEpisodes}>
          <h2>Todos episódios</h2>
          <table cellSpacing={0}>
            <thead>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </thead>
            <tbody>
              {allEpisodes.map(episode => {
                return (
                  <tr key={episode.id}>
                    <td>
                      <Image
                        src={episode.thumbnail}
                        width={120}
                        height={120}
                        alt={episode.title}
                        objectFit="cover"
                      />
                    </td>
                    <td>
                      <a href="">{episode.title}</a>
                    </td>
                    <td>{episode.members}</td>
                    <td>{episode.publishedAt}</td>
                    <td>{episode.durationAsString}</td>
                    <td>
                      <button>
                        <img src="/play-green.svg" alt="Tocar episódio"/>
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
      </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('/episodes', {
    params: {
     _limit: 12,
     _sort: 'published_at',
     _order: 'desc',
    }
  })

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {locale: ptBR}),
      description: episode.description,
      duration: episode.file.duration,
      durationAsString: convertDurationToTimeString(episode.file.duration),
      url: episode.file.url,
    }
  })

  const latestEpisodes = episodes.slice(0,2)
  const allEpisodes = episodes.slice(2, episodes.lenght)

  return {
    props: {
      latestEpisodes,
      allEpisodes,
    },
    revalidate: 60*60*8, //Refresh a cada 8 horas
  }
}