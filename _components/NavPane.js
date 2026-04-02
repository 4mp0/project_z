
import CardContent from "./CardContent"

export default function NavPane() {
    return (
        <CardContent>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div className="nav-links">
                    <a href="/home">Home</a>
                    <a href="/AI">AI</a>
                    <a href="/home">Config</a>
                </div>

                <div>
                    <h1 style={{
                            cursor: 'pointer'
                        }}
                        onClick={() => { window.location.href = '/home' }}
                    >
                        Project-Z
                    </h1>
                </div>

                <div className="nav-links">
                    <a href="https://github.com/4mp0">Github</a>
                    <a href="/home">About</a>
                </div>
            </div>
        </CardContent>

    )
}