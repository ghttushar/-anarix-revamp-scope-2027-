import { DATE_FORMAT_17 } from '@legacy/constants/datetime.constants';
import { LOG_ENTITY_TYPES } from '@legacy/constants/logs.constants';
import { ILogsData } from '@legacy/interfaces/logs/logs.interface';
import { convertUtcToTimezoneDate } from '@legacy/utils/datetime.utils';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogsBulkPopup from './logs-bulk-popup';
import styles from './logs-change-cell.module.scss';
import LogsTablePopup from './logs-table-popup';

const EXECUTE_ROUTE = {
  RULE: '/advertising/rules/applied',
  DAYPARTING_JOB: '/dayparting',
};

/** Lets a long name such as Anarix_B07XK2_SP_Auto wrap after its underscores, not in the middle of a word. */
export const breakable = (value: string) => value.replace(/_/g, '_​');

const popupSubtitle = (data: ILogsData) =>
  [
    data.userName || data.userId,
    data.timestamp
      ? convertUtcToTimezoneDate(data.timestamp, DATE_FORMAT_17)
      : null,
  ]
    .filter(Boolean)
    .join(' · ');

/**
 * The "View ..." link of a log that has more to show, or nothing when it has none:
 * a bulk edit opens every row, a create opens the item it made, an execute goes to its rule or dayparting job.
 */
/** className replaces the link's own look (the Logs table draws it in this app's link style). */
export default function LogViewLink({ data, className }: { data: ILogsData; className?: string }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  if (data.logType === 'BULK_EDIT' && data.bulkChanges?.length) {
    return (
      <>
        <button
          type="button"
          className={className ?? styles.link}
          title={`View ${data.bulkChanges.length.toLocaleString()} changes`}
          onClick={() => setOpen(true)}
        >
          View bulk edit
        </button>
        {open && <LogsBulkPopup log={data} onClose={() => setOpen(false)} />}
      </>
    );
  }

  if (data.logType === 'EXECUTE' && data.executeTarget) {
    return (
      <button
        type="button"
        className={className ?? styles.link}
        title={data.executeTarget.name}
        onClick={() => navigate(EXECUTE_ROUTE[data.executeTarget!.kind])}
      >
        View execution
      </button>
    );
  }

  if (data.logType === 'CREATE' && data.createdTable) {
    const entity = (
      LOG_ENTITY_TYPES[data.entityType ?? ''] ?? 'item'
    ).toLowerCase();
    return (
      <>
        <button
          type="button"
          className={className ?? styles.link}
          onClick={() => setOpen(true)}
        >
          View created {entity}
        </button>
        {open && (
          <LogsTablePopup
            title={`Created ${entity}`}
            subtitle={popupSubtitle(data)}
            table={data.createdTable}
            onClose={() => setOpen(false)}
          />
        )}
      </>
    );
  }

  return null;
}
