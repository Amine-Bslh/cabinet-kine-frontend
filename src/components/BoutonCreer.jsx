function BoutonCreer({ onClick, label = 'Creer' }) {
    return (
        <button onClick={onClick} className="btn-creer">
            <span className="btn-creer-text">{label}</span>
            <span className="btn-creer-icon">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
          <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
        </button>
    );
}

export default BoutonCreer;