function BoutonDeconnexion({ onClick }) {
    return (
        <button onClick={onClick} className="btn-deconnexion">
      <span className="btn-deconnexion-icon">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
            <span className="btn-deconnexion-text">Deconnexion</span>
        </button>
    );
}

export default BoutonDeconnexion;