export const TEAMS_COLUMNS = [
    { key: 'id', label: 'ID', type: 'number', tableCol: true, editable: false, section: 'General' },
    { key: 'team_name', label: 'Team Name', type: 'text', tableCol: true, required: true, section: 'General' },
];

export const PLAYERS_COLUMNS = [
    { key: 'id', label: 'ID', type: 'number', tableCol: true, editable: false, section: 'General' },
    { key: 'player_name', label: 'Player Name', type: 'text', tableCol: true, required: true, section: 'General' },
    { key: 'team_name', label: 'Team', type: 'text', tableCol: true, editable: false, section: 'General' },
    { key: 'position', label: 'Position', type: 'text', tableCol: true, section: 'General' },
    { key: 'grade', label: 'Grade', type: 'text', tableCol: true, section: 'General' },
    { key: 'year_playing', label: 'Year Playing', type: 'text', tableCol: true, section: 'General' },
    { key: 'team_id', label: 'Team', type: 'select', optionsKey: 'teams', optionLabel: 'team_name', required: true, section: 'Team' },
    { key: 'bio', label: 'Bio', type: 'textarea', section: 'Details' },
    { key: 'picture', label: 'Player Photo', type: 'image', imageFolder: 'rosters', keyField: 'picture_key', section: 'Details' },
    { key: 'sponsor_link', label: 'Sponsor Link (legacy, superseded by Stripe sponsorship)', type: 'text', section: 'Details' },
];

export const ANNOUNCEMENTS_COLUMNS = [
    { key: 'id', label: 'ID', type: 'number', tableCol: true, editable: false, section: 'General' },
    { key: 'announcement_title', label: 'Title', type: 'text', tableCol: true, required: true, section: 'General' },
    { key: 'announcement', label: 'Announcement', type: 'textarea', tableCol: true, section: 'General' },
];

export const INFO_COLUMNS = [
    { key: 'id', label: 'ID', type: 'number', tableCol: true, editable: false, section: 'General' },
    { key: 'info_title', label: 'Title', type: 'text', tableCol: true, required: true, section: 'General' },
    { key: 'info_description', label: 'Description', type: 'textarea', tableCol: true, section: 'General' },
    { key: 'info_link', label: 'Link', type: 'text', tableCol: true, section: 'General' },
];

export const SPONSORS_COLUMNS = [
    { key: 'id', label: 'ID', type: 'number', tableCol: true, editable: false, section: 'General' },
    { key: 'sponsor_name', label: 'Sponsor Name', type: 'text', tableCol: true, required: true, section: 'General' },
    { key: 'sponsor_level', label: 'Level', type: 'text', tableCol: true, section: 'General' },
    { key: 'sponsor_website', label: 'Website', type: 'text', tableCol: true, section: 'General' },
    { key: 'sponsor_address', label: 'Address', type: 'text', section: 'Details' },
    { key: 'sponsor_phone', label: 'Phone', type: 'text', section: 'Details' },
    { key: 'sponsor_bio', label: 'Bio', type: 'textarea', section: 'Details' },
    { key: 'sponsor_photo', label: 'Sponsor Photo', type: 'image', imageFolder: 'sponsors', keyField: 'sponsor_photo_key', section: 'Details' },
];

export const SCHEDULES_COLUMNS = [
    { key: 'id', label: 'ID', type: 'number', tableCol: true, editable: false, section: 'General' },
    { key: 'event_date', label: 'Date', type: 'date', tableCol: true, required: true, section: 'General' },
    { key: 'event_name', label: 'Event Name', type: 'text', tableCol: true, section: 'General' },
    { key: 'event_type', label: 'Event Type', type: 'text', tableCol: true, section: 'General' },
    { key: 'opponent', label: 'Opponent', type: 'text', tableCol: true, section: 'General' },
    { key: 'team_names', label: 'Teams', type: 'text', tableCol: true, editable: false, section: 'General' },
    { key: 'result', label: 'Result', type: 'text', tableCol: true, section: 'General' },
    { key: 'team_ids', label: 'Teams (select one or more)', type: 'multiselect', optionsKey: 'teams', optionLabel: 'team_name', dataField: 'team_ids', section: 'Teams' },
    { key: 'event_time', label: 'Event Time', type: 'time', section: 'Details' },
    { key: 'event_description', label: 'Description', type: 'text', section: 'Details' },
    { key: 'event_address', label: 'Address', type: 'text', section: 'Details' },
    { key: 'event_city', label: 'City', type: 'text', section: 'Details' },
    { key: 'event_state', label: 'State', type: 'text', section: 'Details' },
    { key: 'event_zip', label: 'Zip', type: 'text', section: 'Details' },
    { key: 'team_score', label: 'Team Score', type: 'number', section: 'Score' },
    { key: 'opponent_score', label: 'Opponent Score', type: 'number', section: 'Score' },
];

export const PHOTOS_COLUMNS = [
    { key: 'id', label: 'ID', type: 'number', tableCol: true, editable: false, section: 'General' },
    { key: 'photo_url', label: 'Photo', type: 'image', imageFolder: 'photos', tableCol: true, section: 'General' },
    { key: 'team_name', label: 'Tagged Team', type: 'text', tableCol: true, editable: false, section: 'General' },
    { key: 'player_name', label: 'Tagged Player', type: 'text', tableCol: true, editable: false, section: 'General' },
    { key: 'event_name', label: 'Tagged Event', type: 'text', tableCol: true, editable: false, section: 'General' },
    { key: 'team_id', label: 'Tag: Team', type: 'select', optionsKey: 'teams', optionLabel: 'team_name', section: 'Tagging' },
    { key: 'roster_id', label: 'Tag: Player', type: 'select', optionsKey: 'players', optionLabel: 'player_name', section: 'Tagging' },
    { key: 'event_id', label: 'Tag: Event', type: 'select', optionsKey: 'events', optionLabel: 'label', section: 'Tagging' },
];

const PAYMENT_METHOD_OPTIONS = [
    { value: 'stripe', label: 'Stripe' },
    { value: 'venmo', label: 'Venmo' },
    { value: 'zelle', label: 'Zelle' },
    { value: 'other', label: 'Other' },
];

const SPONSORSHIP_STATUS_DISPLAY = {
    club_confirmed: { label: 'Club Confirmed', className: 'font-bold text-green-700' },
    club_rejected: { label: 'Not Received', className: 'font-bold text-roseRed' },
    user_confirmed: { label: 'User confirmed Payment', className: 'text-gray-700' },
    user_started: { label: 'Started', className: 'text-gray-500' },
};

// Same four values as SPONSORSHIP_STATUS_DISPLAY, offered as a select for manual entry --
// left unselected ("none") an admin-added row's status stays null/unknown, same as a fresh
// self-reported row before the sponsor takes any action.
const SPONSORSHIP_STATUS_OPTIONS = [
    { value: 'user_started', label: 'Started' },
    { value: 'user_confirmed', label: 'User confirmed Payment' },
    { value: 'club_confirmed', label: 'Club Confirmed' },
    { value: 'club_rejected', label: 'Not Received' },
];

export const SPONSORSHIPS_COLUMNS = [
    { key: 'id', label: 'ID', type: 'number', tableCol: true, editable: false, narrow: true, section: 'General' },
    { key: 'player_name', label: 'Player', type: 'text', tableCol: true, editable: false, section: 'General' },
    {
        key: 'sponsorship_status', label: 'Status', type: 'text', tableCol: true, editable: false, section: 'General',
        // Priority: the club's own disposition (confirmed/rejected) always wins; otherwise fall back
        // to how far the sponsor got on their own. Nothing at all -> show a plain dash, not a guess.
        render: (val) => {
            const display = SPONSORSHIP_STATUS_DISPLAY[val];
            return display ? <span className={display.className}>{display.label}</span> : <span className="text-gray-400">—</span>;
        },
    },
    {
        key: 'sponsor_email', label: 'Sponsor Email', type: 'text', tableCol: true, required: true, section: 'General',
        hideWhen: (form) => form.is_anonymous,
    },
    { key: 'payment_method', label: 'Method', type: 'select', staticOptions: PAYMENT_METHOD_OPTIONS, optionValue: 'value', optionLabel: 'label', valueType: 'string', tableCol: true, required: true, section: 'General' },

    { key: 'payer_identifier', label: 'Handle', type: 'text', tableCol: true, secondRow: true, alignWith: 'player_name', section: 'General' },
    {
        key: 'sponsor_name', label: 'Sponsor', type: 'text', tableCol: true, secondRow: true, alignWith: 'sponsorship_status', required: true, section: 'General',
        hideWhen: (form) => form.is_anonymous,
    },
    {
        // Client-only toggle (not a DB column) -- mirrors the public sponsor form's "Remain
        // Anonymous" option so an admin can manually record an anonymous sponsorship too.
        // AdminCrudTable substitutes the sentinel sponsor_name/sponsor_email values on save.
        key: 'is_anonymous', label: 'Anonymous Sponsor (fills Sponsor/Email with a placeholder)', type: 'checkbox', section: 'General',
        anonymizeFields: { sponsor_name: 'Anonymous', sponsor_email: 'anonymous' },
    },
    {
        key: 'sponsorship_status', label: 'Status', type: 'select', staticOptions: SPONSORSHIP_STATUS_OPTIONS,
        optionValue: 'value', optionLabel: 'label', valueType: 'string', section: 'General',
    },
    {
        key: 'created_at', label: 'Submitted', type: 'text', tableCol: true, secondRow: true, alignWith: 'sponsor_email', editable: false, section: 'General',
        render: (val) => (val
            ? new Date(val).toLocaleString('en-US', { timeZone: 'America/Chicago', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' })
            : <span className="text-gray-400">—</span>),
    },
    {
        key: 'amount', label: 'Amount ($)', type: 'number', tableCol: true, secondRow: true, alignWith: 'payment_method', required: true, section: 'General',
        render: (val) => (val === null || val === undefined || val === '' ? <span className="text-gray-400">—</span> : `$${Number(val).toFixed(2)}`),
    },

    { key: 'stripe_checkout_session_id', label: 'Stripe Session (read-only)', type: 'text', editable: false, section: 'General' },
    { key: 'roster_id', label: 'Player', type: 'select', optionsKey: 'players', optionLabel: 'player_name', required: true, section: 'Player' },
];

const DUES_STATUS_DISPLAY = {
    paid: { label: 'Paid', className: 'font-bold text-green-700' },
    partial: { label: 'Partial', className: 'font-bold text-yellow-600' },
    unpaid: { label: 'Unpaid', className: 'text-gray-500' },
};

export const DUES_COLUMNS = [
    { key: 'id', label: 'ID', type: 'number', tableCol: true, editable: false, narrow: true, section: 'General' },
    { key: 'player_name', label: 'Player', type: 'text', tableCol: true, editable: false, section: 'General' },
    { key: 'team_name', label: 'Team', type: 'text', tableCol: true, editable: false, section: 'General' },
    {
        key: 'dues_paid', label: 'Status', type: 'text', tableCol: true, editable: false, section: 'General',
        // dues_paid wins over dues_partial if both were somehow set; neither set -> Unpaid, not a dash --
        // unlike Sponsorships, "no status yet" here always means the player simply hasn't paid.
        render: (val, row) => {
            const key = row.dues_paid ? 'paid' : row.dues_partial ? 'partial' : 'unpaid';
            const display = DUES_STATUS_DISPLAY[key];
            return <span className={display.className}>{display.label}</span>;
        },
    },
    {
        key: 'dues_amount_paid', label: 'Amount Paid ($)', type: 'number', tableCol: true, section: 'General',
        render: (val) => (val === null || val === undefined || val === '' ? <span className="text-gray-400">—</span> : `$${Number(val).toFixed(2)}`),
    },
    { key: 'dues_paid', label: 'Paid in Full', type: 'checkbox', section: 'Details' },
    { key: 'dues_partial', label: 'Paid Partially', type: 'checkbox', section: 'Details' },
    { key: 'roster_id', label: 'Player', type: 'select', optionsKey: 'players', optionLabel: 'player_name', required: true, section: 'Player' },
];

export const TABS = [
    { key: 'teams', label: 'Teams', config: { title: 'Teams', apiSlug: 'teams', pkField: 'id', searchPlaceholder: 'Search by team name...', columns: TEAMS_COLUMNS } },
    { key: 'players', label: 'Roster', config: { title: 'Players', apiSlug: 'players', pkField: 'id', searchPlaceholder: 'Search by player or team...', columns: PLAYERS_COLUMNS } },
    { key: 'schedules', label: 'Schedules', config: { title: 'Schedules', apiSlug: 'schedules', pkField: 'id', searchPlaceholder: 'Search by event name or opponent...', columns: SCHEDULES_COLUMNS } },
    { key: 'sponsorships', label: 'Sponsorships', config: { title: 'Sponsorships', apiSlug: 'sponsorships', pkField: 'id', searchPlaceholder: 'Search by player or sponsor...', columns: SPONSORSHIPS_COLUMNS, confirmField: 'sponsorship_status', confirmValue: 'club_confirmed', rejectValue: 'club_rejected', exportUrl: '/api/adminData/sponsorships/export', tightRows: true } },
    { key: 'dues', label: 'Dues', config: { title: 'Dues', apiSlug: 'dues', pkField: 'id', searchPlaceholder: 'Search by player or team...', columns: DUES_COLUMNS, tightRows: true, zebraRows: true } },
    { key: 'announcements', label: 'Announcements', config: { title: 'Announcements', apiSlug: 'announcements', pkField: 'id', searchPlaceholder: 'Search announcements...', columns: ANNOUNCEMENTS_COLUMNS } },
    { key: 'info', label: 'Info', config: { title: 'Info', apiSlug: 'info', pkField: 'id', searchPlaceholder: 'Search info...', columns: INFO_COLUMNS } },
    { key: 'sponsors', label: 'Sponsors', config: { title: 'Sponsors', apiSlug: 'sponsors', pkField: 'id', searchPlaceholder: 'Search sponsors...', columns: SPONSORS_COLUMNS } },
    { key: 'photos', label: 'Photos', config: { title: 'Photos', apiSlug: 'photos', pkField: 'id', searchPlaceholder: 'Search photos by tag...', columns: PHOTOS_COLUMNS } },
];
