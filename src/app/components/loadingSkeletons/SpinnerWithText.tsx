
import './spinner.css'

export const SpinnerWithText = ({ height, text }: { height: number, text: string }) => {
    return (
        <div style={{ height, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', backgroundColor:'lightgray' }}>
            <div style={{ marginBottom: '10px' }}>{text}</div>
            <div className='spinner' style={{ width: '50px', height: '50px', }}></div>

        </div>
    )
}
