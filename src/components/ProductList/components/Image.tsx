import { useNearScreen } from "../../../hooks/useNearScreen";

const Image = ({url, title} : {url: string, title: string}) => {
  const [isNear, fromRef] = useNearScreen();

  return (
    <figure ref={typeof fromRef === 'boolean' ? undefined : fromRef}>
      {isNear && <img src={url} alt={title} style={{width: '100%'}} />}
    </figure>
  )
}

export default Image