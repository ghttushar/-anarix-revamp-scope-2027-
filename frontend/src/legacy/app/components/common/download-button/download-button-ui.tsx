import { TooltipPlacement } from '@legacy/enums/tooltip-texts.enums';
import {
  IDownloadButtonOptions,
  IDownloadButtonUIProps,
} from '@legacy/interfaces/download-button.interface';
import { getDownloadIconColor } from '@legacy/utils/advertising.utils';
import IconButton from '@mui/material/IconButton';
import { DownloadSimpleIcon } from '@phosphor-icons/react';
import { GlobalDataTestIds } from '@legacy/test-ids/global';
import { useCallback, useEffect, useRef, useState } from 'react';
import HoverInfoTooltip from '../hover-info-tooltip/hover-info-tooltip';
import styles from './download-button.module.scss';

const downloadIconStyles = {
  borderRadius: 'calc(0.4 * var(--np-rem))',
  display: 'inline-flex',
  padding: 'calc(0.3 * var(--np-rem))',
  alignItems: 'center',
  height: 'calc(3 * var(--np-rem))',
  width: 'calc(3 * var(--np-rem))',

  '&.Mui-disabled': {
    cursor: 'not-allowed !important',
  },
  '&:hover': {
    borderColor: '#8b8b8b',
  },
};

export default function DownloadButtonUI({
  hoverInfoText,
  isDownloading,
  handleOriginalDownload,
  downloadOptionsRequired,
  iconButton,
  squareDimension,
  downloadOptionsArray,
  isDisabled = false,
  iconColor,
  iconSize = 15,
}: IDownloadButtonUIProps) {
  const [isDownloadClicked, setIsDownloadClicked] = useState<boolean>(false);

  const handleDownloadClicked = () => {
    if (downloadOptionsRequired === true)
      setIsDownloadClicked(!isDownloadClicked);
    else handleOriginalDownload();
  };

  const handleCloseDownloadOptions = useCallback(() => {
    setIsDownloadClicked(false);
  }, []);

  return (
    <div
      className={styles.downloadContainer}
      data-test={GlobalDataTestIds.DOWNLOAD_BUTTON}
    >
      <div
        style={{
          display: 'block',
        }}
      >
        <HoverInfoTooltip
          title={hoverInfoText || 'Download'}
          position={TooltipPlacement.Top}
        >
          <IconButton
            sx={{
              ...downloadIconStyles,
              width: squareDimension,
              height: squareDimension,
              background: iconButton ? '' : '#ffffff',
              border: iconButton ? '' : '1px solid #dadceb;',
              cursor: isDownloading ? 'not-allowed !important' : 'pointer',
            }}
            disableRipple
            disabled={isDownloading === true || isDisabled === true}
            onClick={handleDownloadClicked}
          >
            <DownloadSimpleIcon
              size={iconSize}
              color={getDownloadIconColor(
                isDownloading,
                isDisabled,
                iconColor,
                iconButton
              )}
            />
          </IconButton>
        </HoverInfoTooltip>
      </div>

      {isDownloadClicked === true &&
        downloadOptionsArray &&
        downloadOptionsArray.length > 0 && (
          <DownloadOptions
            handleCloseDownloadOptions={handleCloseDownloadOptions}
            downloadOptionsArray={downloadOptionsArray.map((option) => {
              return {
                ...option,
                onClick: () => {
                  option.onClick();
                  setIsDownloadClicked(false);
                },
              };
            })}
          />
        )}
    </div>
  );
}

interface IDownloadOptionsProps {
  handleCloseDownloadOptions: () => void;
  downloadOptionsArray: Array<IDownloadButtonOptions>;
}

const DownloadOptions = ({
  handleCloseDownloadOptions,
  downloadOptionsArray,
}: IDownloadOptionsProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isMounted = useRef(false);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!isMounted.current) {
        isMounted.current = true;
        return;
      }

      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        event.target !== document.body
      ) {
        handleCloseDownloadOptions();
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [handleCloseDownloadOptions]);

  return (
    <div
      className={styles.optionsContainer}
      ref={containerRef}
      data-test={GlobalDataTestIds.DOWNLOAD_OPTIONS_CONTAINER}
    >
      {downloadOptionsArray.map((option, index) => (
        <div
          key={index}
          className={`${styles.option} ${
            option.isDisabled ? styles['disabled-option'] : ''
          }`}
          onClick={!option.isDisabled ? option.onClick : undefined}
        >
          <span>{option.title}</span>
        </div>
      ))}
    </div>
  );
};
