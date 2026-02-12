/* eslint-disable react/prop-types */
import './releaseItemMobile.css';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

function ReleaseItemMobile({ release, onInfoClick }) {
  return (
    <div className="releaseItemMobile">
      <div className="releaseItemMobileInfoArea">
        <div className="releaseItemMobileInfo">
          <p className="releaseItemM_artist">
            {release.artists}
            {release.artists && release.labels && ' | '}
            <span className="releaseItemM_label">{release.labels}</span>
          </p>

          <p className="releaseItemM_title">{release.title}</p>

          <p className="releaseItemM_type">
            {release.release_type}
            {release.release_type && release.disc_speed && ' | '}
            {release.disc_speed}
            {release.disc_speed && 'T'}
          </p>
        </div>

        <div className="releaseItemMobileInfoBtnArea">
          <InfoOutlinedIcon
            className="releaseItemM_infoIcon"
            onClick={() => onInfoClick?.(release)}
          />
        </div>
      </div>

      <div className="releaseItemM_separator" />
    </div>
  );
}

export default ReleaseItemMobile;
