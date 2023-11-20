
export interface ITakozProps {
    width?: number | string
    height?: number | string
}

export default function Takoz(props: Readonly<ITakozProps>){
    return (
        <div style={{
            width: props.width ?? "2rem",
            height: props.height ?? "2rem"
        }}></div>
    )
}