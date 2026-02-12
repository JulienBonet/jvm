/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

function GroupHeader({ letter, isOpen, onToggle }) {
  return (
    <div
      onClick={onToggle}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px',
        borderBottom: '1px solid #ccc',
        cursor: 'pointer',
      }}
    >
      <span style={{ fontSize: '20px', fontWeight: 'bold' }}>{letter}</span>

      <span style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>⌄</span>
    </div>
  );
}

export default GroupHeader;
