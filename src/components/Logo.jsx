function Logo({ size = 40 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="68" r="8" fill="#264653" />
            <path d="M50 60 Q50 45 35 30 Q55 32 58 50 Q58 58 50 60 Z" fill="#2a9d8f" />
            <path d="M50 60 Q50 42 65 25 Q48 30 45 48 Q45 57 50 60 Z" fill="#21867a" />
            <path d="M50 55 Q35 50 20 55 Q30 40 50 45 Q52 50 50 55 Z" fill="#e76f51" />
            <path d="M50 55 Q65 50 80 55 Q70 40 50 45 Q48 50 50 55 Z" fill="#e9c46a" />
        </svg>
    );
}

export default Logo;