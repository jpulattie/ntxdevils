'use client'

import { useState } from 'react';

const TABS = [
    { key: 'overview', label: 'Overview' },
    { key: 'governance', label: 'Governance' },
    { key: 'president', label: 'President' },
    { key: 'vp', label: 'Vice President' },
    { key: 'treasurer', label: 'Treasurer' },
    { key: 'secretary', label: 'Secretary' },
    { key: 'mal', label: 'Member at Large' },
    { key: 'womens', label: "Women's Rep" },
];

const BOARD_OVERVIEW = [
    { role: 'Club President', reportsTo: 'Members and the Board', focus: 'Leadership, governance, external representation' },
    { role: 'Vice President', reportsTo: 'President and the Board', focus: 'Football operations, coaches, players, development' },
    { role: 'Treasurer', reportsTo: 'President and the Board', focus: 'Budget, banking, financial reporting, tax compliance' },
    { role: 'Secretary', reportsTo: 'President and the Board', focus: 'Meetings, minutes, records, correspondence, compliance calendar' },
    { role: 'Member at Large', reportsTo: 'The Board', focus: 'Assigned projects, member voice, extra capacity' },
    { role: "Women's Representative", reportsTo: 'President and the Board', focus: "Women's football program, players and participation" },
];

const EXPECTATIONS = [
    'Serve from the 2026 AGM until the next AGM, and hand over records, logins and files to your successor.',
    "Attend monthly Board meetings and the AGM; send apologies in advance if you can't.",
    'Act in the best interests of the Club and declare any conflict of interest.',
    "Follow the Club's Constitution and By-Laws, Code of Conduct, and the rules of USAFL and any league we play in.",
    'Commit no Club money without Board approval or an approved budget line.',
    'Keep Club documents in the shared Club drive and use Club accounts for Club business.',
    'Complete any screening or safeguarding training the Club or USAFL requires.',
    'Report on your portfolio at each monthly meeting and at the AGM.',
    'Help other Board members as needed and take on tasks the Board assigns.',
];

const LEGAL_DUTIES = [
    { name: 'Duty of care:', text: 'come prepared, read the financial reports, ask questions and make informed decisions.' },
    { name: 'Duty of loyalty:', text: 'put the Club first. Disclose any personal or family interest in a Club decision, and step out of that discussion and vote.' },
    { name: 'Duty of obedience:', text: "follow the Club's charitable purpose, Certificate of Formation, By-Laws and the law." },
];

const MUST_NOT = [
    'Let any Board member, relative or insider profit from Club money or assets (no private benefit).',
    "Support or oppose any candidate for public office, in the Club's name or with Club resources.",
    "Spend more than a small part of the Club's effort on lobbying.",
    'Pay Board members for serving. Reasonable, receipted expense refunds are fine.',
];

const POLICIES = [
    'Conflict of Interest policy, with a signed annual disclosure from every Board member',
    'Whistleblower policy',
    'Document Retention and Destruction policy',
    'Expense Reimbursement and Financial Controls policy (spending limits, two-person approval)',
    'Gift Acceptance policy',
    'Safeguarding and Code of Conduct policy',
];

const COMPLIANCE_CALENDAR = [
    { when: 'January 31', what: 'Year-end donor acknowledgment letters; 1099 forms to paid contractors', lead: 'Treasurer' },
    { when: 'February Board meeting', what: 'Approve the 2027 budget', lead: 'Treasurer' },
    { when: 'Before the season', what: 'Renew insurance, including directors and officers (D&O) cover; register players with USAFL; complete screening', lead: 'President, Vice President' },
    { when: 'May 15', what: 'File the IRS Form 990-N, 990-EZ or 990 for 2026', lead: 'Treasurer' },
    { when: 'Each year', what: 'Collect signed conflict of interest disclosures; review policies', lead: 'Secretary' },
    { when: 'When the state asks (up to every 4 years)', what: 'Texas Secretary of State periodic report (Form 802)', lead: 'Secretary' },
    { when: 'AGM', what: 'Annual reports, financial statements and elections', lead: 'Whole Board' },
];

const ROLES = {
    president: {
        num: '01',
        title: 'Club President',
        reportsTo: 'Members and the Board',
        tagline: "The President leads the Club and makes sure the Board, its subcommittees and volunteers deliver on the Club's plans.",
        objectives: [
            'Provide strong, effective leadership for the Club.',
            "Grow participation and success in our men's and women's teams, and give new and developing players good coaching and a pathway onto the senior teams.",
            'Make sure the Club is run well administratively, financially and socially to support what happens on the field.',
            'Provide a safe, welcoming and enjoyable environment for all members, with football played competitively and fairly.',
            'Support the Board so the Club runs efficiently.',
        ],
        responsibilities: [
            'Chair all Board meetings and the AGM, and set meeting agendas with the Secretary.',
            "Lead the Board in setting the Club's priorities and annual plan for 2027.",
            'Make sure Board members and subcommittees fulfil their responsibilities.',
            'Represent the Club, or appoint a delegate, at USAFL, league and delegate meetings.',
            "Act as the Club's main contact for sponsors, partners, venues and the media.",
            'Oversee risk, insurance, safeguarding and Code of Conduct matters, including handling complaints and disputes.',
            "Co-sign or approve payments in line with the Club's financial controls.",
            'Plan for succession and recruit volunteers for Board and subcommittee roles.',
            "Report on the Club's year to members at the AGM.",
        ],
        duties: [
            "Make sure the Board keeps the Club's activities in line with its charitable purpose.",
            'Make sure the annual IRS filing, the Texas reports and the Texas tax exemptions are kept current.',
            'Make sure every Board member signs the annual conflict of interest disclosure, and that conflicts are recorded and managed at meetings.',
            "Keep the Board's policies (conflict of interest, whistleblower, document retention, financial controls) current and followed.",
            'Make sure the Club holds suitable insurance, including general liability and directors and officers (D&O) cover.',
            'Keep the Club out of political campaign activity, and approve any public statement on behalf of the Club.',
        ],
        relationships: [
            'Reports to the members and the Board.',
            'Works closely with the Vice President, Treasurer and Secretary.',
            'Supports all coaches, managers, Board members and volunteers.',
            'Represents the Club to USAFL, other clubs, sponsors and the community.',
        ],
        accountability: [
            'Accountable to the members and the Board.',
            'Reports on Club operations at each monthly Board meeting.',
            'Commits no Club money or action without Board approval or an approved budget line.',
        ],
    },
    vp: {
        num: '02',
        title: 'Vice President',
        reportsTo: 'President and the Board',
        tagline: "The Vice President runs the Club's football operations and stands in for the President when needed.",
        objectives: [
            'Oversee all football matters across the Club.',
            'Lead and support coaches, players, support staff and volunteers.',
            'Support the President and the rest of the Board.',
        ],
        responsibilities: [
            'Chair meetings and act for the President when the President is absent.',
            'Make sure every part of football operations (training, selection, game days, travel and tournaments) runs well so on-field performance is maximized.',
            'Recruit and appoint coaches in line with Board policy, and check that coaches and support staff carry out their duties.',
            'Run player recruitment and retention, including new-player and come-and-try sessions.',
            'Oversee the development program so new players learn the game and progress to the senior teams.',
            'Make sure players are registered with USAFL and eligible before they play.',
            'Make sure first aid, concussion and player-safety procedures are in place at training and games.',
            'Coordinate the season fixture, training venues and equipment with the Secretary and Treasurer.',
            "Work with the Women's Representative so the women's program gets fair access to coaching, training and resources.",
        ],
        duties: [
            "Run football programs that serve the Club's charitable purpose, such as developing amateur players and opening the game to the community.",
            'Set player fees, fee waivers and travel support under a written, Board-approved policy that treats players fairly. No player, coach or Board member gets special financial treatment.',
            'Get written agreements for any paid coach or contractor, at reasonable rates approved by the Board, and pass payment details to the Treasurer for tax reporting.',
            'Make sure coaches and volunteers complete the screening and safeguarding training the Club and USAFL require, and keep records of it.',
            "Report injuries and incidents promptly so the Club meets its insurance requirements.",
        ],
        relationships: [
            'Reports to the President and the Board.',
            'Supports all coaches, players, support staff and volunteers.',
            "Works with the Women's Representative on the women's program.",
            'Liaises with USAFL, opposing clubs, venues and Club suppliers.',
        ],
        accountability: [
            'Accountable to the President and the Board.',
            'Reports on football operations at each monthly Board meeting.',
            'Commits no Club money or action without Board approval or an approved budget line.',
        ],
    },
    treasurer: {
        num: '03',
        title: 'Treasurer',
        reportsTo: 'President and the Board',
        tagline: "The Treasurer keeps the Club's money in order so the Board always has an accurate, current picture of its finances.",
        objectives: [
            "Run a financial management and reporting system that gives the Board a true and accurate view of the Club's finances at all times.",
            'Support the Board so the Club runs efficiently.',
        ],
        responsibilities: [
            'Prepare the 2027 annual budget, drafted with the Executive, for Board approval at the February Board meeting.',
            "Manage the Club's bank accounts and payment platforms, and deposit funds promptly.",
            'Collect and track membership dues, registration fees, sponsorship and fundraising income.',
            'Keep accurate records of all income and spending, with receipts kept as an audit trail.',
            'Present bills for approval, decide payment priority, and pay approved bills on time.',
            "Make sure no one exceeds their spending authority without Board approval.",
            'Report monthly to the Board on income, spending and performance against budget.',
            'Oversee any accounts or funds held by Club subcommittees or teams.',
            'Manage any credit facility, and invest any surplus only after Board approval.',
            'Make sure all IRS and Texas filings are made on time, including the annual Form 990 series return and any 1099 forms for paid contractors.',
            "Arrange an annual review or audit of the Club's accounts.",
            'Make financial records available to the Board and members as the Constitution and Texas law require.',
            'Present the annual financial report to members at the AGM.',
        ],
        duties: [
            'File the right IRS annual return by the 15th day of the fifth month after year-end (May 15 for a calendar year). Most clubs with gross receipts normally of $50,000 or less file the 990-N e-Postcard. The 990-EZ covers receipts under $200,000 and assets under $500,000. Larger clubs file the full Form 990.',
            'Send donors a written acknowledgment for any single gift of $250 or more, stating whether they received anything in return.',
            'Give a written disclosure when someone pays more than $75 partly as a donation and partly for goods or services, such as a gala ticket.',
            'Track restricted donations and grants separately, and spend them only as the donor or grantor specified.',
            "Keep the Club's Texas sales and franchise tax exemptions in place. Use the exemption certificate for Club purchases, and collect sales tax on Club sales where the law requires it, such as merchandise.",
            "Watch for income unrelated to the Club's purpose (for example, regular advertising sales), and file IRS Form 990-T if that gross income reaches $1,000 in a year.",
            'Pay expenses only with receipts and approval, and never let one person both approve and pay the same bill.',
            'Keep the IRS determination letter and the last three annual returns ready for anyone who asks to inspect them.',
        ],
        relationships: [
            'Reports to the President and the Board.',
            'Works with the Executive on the budget and financial controls.',
            "Liaises with the bank, the Club's accountant, sponsors and suppliers.",
        ],
        accountability: [
            'Accountable to the President and the Board.',
            'Gets Board approval for the annual budget, then acts within its limits.',
            'Provides a monthly report to the Board of all financial transactions.',
        ],
    },
    secretary: {
        num: '04',
        title: 'Secretary',
        reportsTo: 'President and the Board',
        tagline: "The Secretary runs the Club's administration: meetings, minutes, records, correspondence and the yearly calendar.",
        objectives: [
            'Give the President, the Board and subcommittees the administrative support they need.',
            'Plan across the whole Club so its activities and deadlines are managed well.',
            'Manage the business that comes before the Board.',
            'Support the Board so the Club runs efficiently.',
        ],
        responsibilities: [
            'Set up the 2027 Club calendar, covering Board meetings, the season, events, registration windows and filing deadlines.',
            'Prepare agendas with the President and send them out before each meeting.',
            'Take minutes of all Board and general meetings and circulate them as the Constitution requires.',
            'Give notice of the AGM and any special meetings, and run the AGM election process.',
            'Keep the current Constitution and By-Laws, and record any changes the members approve.',
            "Keep the Club's records in order, including minutes, policies, contracts, insurance documents and the member register.",
            'File the Texas Secretary of State periodic report (Form 802) when the state requests it, and keep the registered agent and director details up to date.',
            'Know the rules of the Club, USAFL, our league and any other governing body, and advise the President and Board.',
            "Manage the Club's email inbox and send correspondence as the President and Board direct.",
            "Coordinate and support the Club's subcommittees.",
            "Prepare a report on the Club's activities for the AGM.",
        ],
        duties: [
            "Keep the Club's key legal documents safe and easy to find: Certificate of Formation, By-Laws, IRS determination letter, exemption application, and Texas exemption letters.",
            'Record in the minutes any conflict of interest declared, who left the room, and how the vote went.',
            'Record Board approval of any payment to a coach, contractor or related party, with the information used to set the amount.',
            "Collect and file every Board member's signed annual conflict of interest disclosure.",
            'Apply the document retention policy: keep minutes and legal documents permanently, and financial records for at least seven years.',
            'Make sure meetings and votes follow the By-Laws (notice, quorum and voting rules), so Board decisions are valid.',
        ],
        relationships: [
            'Reports to the President and the Board.',
            'Works closely with the President on agendas and correspondence.',
            'Liaises with subcommittees, USAFL and other external bodies.',
        ],
        accountability: [
            'Accountable to the President and the Board.',
            'Reports on administration at each monthly Board meeting.',
            'Commits no Club money or action without Board approval or an approved budget line.',
        ],
    },
    mal: {
        num: '05',
        isNew: true,
        title: 'Member at Large',
        reportsTo: 'President and the Board',
        tagline: 'The Member at Large is a voting Board member without a fixed portfolio. They speak for the general membership and lead projects the Board assigns.',
        objectives: [
            'Represent the views and interests of the general membership at Board level.',
            'Give the Board extra capacity to deliver projects and events.',
            'Support the Board so the Club runs efficiently.',
        ],
        responsibilities: [
            'Lead one or more portfolios the Board assigns at the start of the term, such as events and social functions, sponsorship, fundraising, merchandise, communications and social media, or volunteer coordination.',
            'Gather feedback from players, members, families and supporters, and raise it with the Board.',
            'Help welcome and settle new members and volunteers.',
            'Help organize Club events, including the season launch, awards night and fundraisers.',
            'Step in to support other Board members when workload is high or a role is vacant.',
            'Report on assigned portfolios at the AGM.',
        ],
        duties: [
            'Run fundraising and events so all money goes through Club accounts, with donor details passed to the Treasurer for acknowledgment letters.',
            'Check Texas charitable raffle rules with the Treasurer before running any raffle; the rules limit how often clubs can hold them and ban cash prizes.',
            "Make sure sponsorship agreements thank sponsors without turning into paid advertising, and send them to the Treasurer for tax review.",
            'Keep Club social media and communications free of political campaign content.',
        ],
        relationships: [
            'Reports to the President and the Board.',
            'Works with whichever Board member leads the related area (for example, the Treasurer on fundraising).',
            'Acts as an open, approachable contact for members.',
        ],
        accountability: [
            'Accountable to the President and the Board.',
            'Reports on assigned portfolios at each monthly Board meeting.',
            'Commits no Club money or action without Board approval or an approved budget line.',
        ],
    },
    womens: {
        num: '06',
        isNew: true,
        title: "Women's Representative",
        reportsTo: 'President and the Board',
        tagline: "The Women's Representative speaks for the Club's women players at Board level and leads the growth of the women's program.",
        objectives: [
            'Represent the interests of women players and members in all Board decisions.',
            "Grow women's participation in the Club, from first-time players to competitive teams.",
            "Make sure the women's program gets fair access to coaching, training time, equipment, funding and promotion.",
            'Support the Board so the Club runs efficiently.',
        ],
        responsibilities: [
            'Bring the views and concerns of women players to the Board and report Board decisions back to them.',
            "Plan and lead recruitment for the women's program, including come-and-try sessions and outreach to the wider community.",
            "Work with the Vice President on women's coaching appointments, training schedules and tournament entries.",
            "Help prepare the women's program budget with the Treasurer, and track spending against it.",
            "Look for sponsors, grants and partners that support women's football.",
            'Make sure the Club is a safe, inclusive environment for women, and act as a contact for players who want to raise concerns.',
            "Liaise with USAFL and other clubs on women's competitions and development.",
            "Promote the women's teams through the Club's website, social media and events.",
            "Report on the women's program at the AGM.",
        ],
        duties: [
            "Work with the Treasurer on grant applications for women's sport, and make sure grant money is tracked and spent only as the grant allows.",
            'Help write grant reports, including participation numbers and outcomes.',
            "Make sure the women's program follows the Club's safeguarding policy, and pass any concern to the President straight away.",
            "Route all women's program fundraising and sponsorship through Club accounts.",
        ],
        relationships: [
            'Reports to the President and the Board.',
            'Works closely with the Vice President on football matters.',
            "Supports women's coaches, captains, players and volunteers.",
            "Liaises with USAFL, other clubs' women's programs and sponsors.",
        ],
        accountability: [
            'Accountable to the President and the Board.',
            "Reports on the women's program at each monthly Board meeting.",
            'Commits no Club money or action without Board approval or an approved budget line.',
        ],
    },
};

function SectionLabel({ children }) {
    return (
        <h3 className="text-xs font-bold text-roseRed tracking-widest uppercase mb-2">{children}</h3>
    );
}

function BulletList({ items }) {
    return (
        <ul className="list-disc list-inside space-y-1 text-myrtleGreen text-left">
            {items.map((item, i) => (
                <li key={i}>{item}</li>
            ))}
        </ul>
    );
}

function Card({ children, className = '' }) {
    return (
        <div className={`bg-white border-2 border-myrtleGreen border-opacity-20 rounded-xl shadow-lg p-4 mb-4 ${className}`}>
            {children}
        </div>
    );
}

function PanelHeader({ label, title, description }) {
    return (
        <div className="bg-myrtleGreen rounded-xl px-4 py-4 mb-4">
            <div className="text-primroseYellow text-xs font-bold tracking-widest uppercase">{label}</div>
            <div className="text-white text-2xl font-bold">{title}</div>
            {description && <p className="text-white text-sm opacity-90 mt-2">{description}</p>}
        </div>
    );
}

function RolePanel({ role }) {
    return (
        <div>
            <div className="bg-myrtleGreen rounded-xl px-4 py-4 mb-4 text-center">
                <div className="text-primroseYellow text-xs font-bold tracking-widest uppercase">
                    {role.isNew ? 'Role Description · New for 2027' : 'Role Description'}
                </div>
                <div className="text-white text-2xl font-bold">{role.title}</div>
                <div className="text-white text-sm opacity-90">Reports to: {role.reportsTo}</div>
                <p className="text-white text-sm opacity-90 mt-2">{role.tagline}</p>
            </div>

            <Card>
                <SectionLabel>Objectives</SectionLabel>
                <BulletList items={role.objectives} />
            </Card>

            <Card>
                <SectionLabel>Responsibilities</SectionLabel>
                <BulletList items={role.responsibilities} />
            </Card>

            <div className="bg-gray-50 border-l-4 border-roseRed rounded-xl p-4 mb-4">
                <SectionLabel>501(c)(3) Duties</SectionLabel>
                <BulletList items={role.duties} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="mb-0">
                    <SectionLabel>Relationships</SectionLabel>
                    <BulletList items={role.relationships} />
                </Card>
                <Card className="mb-0">
                    <SectionLabel>Accountability</SectionLabel>
                    <BulletList items={role.accountability} />
                </Card>
            </div>
        </div>
    );
}

function OverviewPanel() {
    return (
        <div>
            <PanelHeader
                label="Overview"
                title="The 2027 Board"
                description="These six role descriptions set out what each NTX Board member is expected to do for the 2027 term. They are for members standing for election at the AGM and for the Board once elected."
            />

            <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm text-left rounded-xl overflow-hidden shadow-lg">
                    <thead>
                        <tr className="bg-myrtleGreen text-white">
                            <th className="px-3 py-2">Role</th>
                            <th className="px-3 py-2">Reports To</th>
                            <th className="px-3 py-2">Main Focus</th>
                        </tr>
                    </thead>
                    <tbody>
                        {BOARD_OVERVIEW.map((row, i) => (
                            <tr key={row.role} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-3 py-2 font-bold text-myrtleGreen">{row.role}</td>
                                <td className="px-3 py-2 text-myrtleGreen">{row.reportsTo}</td>
                                <td className="px-3 py-2 text-myrtleGreen">{row.focus}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Card>
                <h3 className="text-lg font-bold text-myrtleGreen mb-2">Expectations of every Board member</h3>
                <ul className="space-y-1 text-myrtleGreen text-left">
                    {EXPECTATIONS.map((item, i) => (
                        <li key={i} className="flex gap-2 items-start">
                            <span className="text-roseRed font-bold">&#10003;</span>
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </Card>
        </div>
    );
}

function GovernancePanel() {
    return (
        <div>
            <PanelHeader
                label="Governance"
                title="Running the Club as a 501(c)(3)"
                description="As a 501(c)(3) charity, the Club must use its money and activities only for its charitable purpose. Every Board member shares responsibility for keeping that status."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 border-l-4 border-roseRed rounded-xl p-4">
                    <SectionLabel>Legal Duties of Every Board Member</SectionLabel>
                    <ul className="list-disc list-inside space-y-1 text-myrtleGreen text-left">
                        {LEGAL_DUTIES.map((d) => (
                            <li key={d.name}>
                                <strong>{d.name}</strong> {d.text}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="bg-gray-50 border-l-4 border-roseRed rounded-xl p-4">
                    <SectionLabel>What a 501(c)(3) Board Must Not Do</SectionLabel>
                    <BulletList items={MUST_NOT} />
                </div>
            </div>

            <Card>
                <SectionLabel>Policies the Board Keeps in Place and Reviews Each Year</SectionLabel>
                <BulletList items={POLICIES} />
            </Card>

            <div className="bg-myrtleGreen rounded-t-xl px-4 py-3">
                <h3 className="text-lg font-bold text-primroseYellow">
                    2027 Compliance Calendar <span className="font-normal text-sm text-primroseYellow text-opacity-80">(assumes a January–December financial year)</span>
                </h3>
            </div>
            <div className="overflow-x-auto mb-4">
                <table className="w-full text-sm text-left rounded-b-xl overflow-hidden shadow-lg">
                    <thead>
                        <tr className="bg-myrtleGreen text-primroseYellow">
                            <th className="px-3 py-2">When</th>
                            <th className="px-3 py-2">What</th>
                            <th className="px-3 py-2">Lead</th>
                        </tr>
                    </thead>
                    <tbody>
                        {COMPLIANCE_CALENDAR.map((row, i) => (
                            <tr key={row.when} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-3 py-2 font-bold text-myrtleGreen whitespace-nowrap">{row.when}</td>
                                <td className="px-3 py-2 text-myrtleGreen">{row.what}</td>
                                <td className="px-3 py-2 text-myrtleGreen whitespace-nowrap">{row.lead}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="bg-roseRed bg-opacity-10 border border-roseRed rounded-xl p-3 text-roseRed font-semibold text-sm">
                Missing the IRS annual filing three years in a row automatically cancels the Club&apos;s tax-exempt status.
            </div>
        </div>
    );
}

export default function Agm() {
    const [activeTab, setActiveTab] = useState(TABS[0].key);

    return (
        <div>
            <div className="inline-block text-center bg-myrtleGreen justify-center rounded-xl px-3 py-2 mt-2 mb-2">
                <h1 className="text-lg font-bold text-white">
                    <strong>AGM &middot; Board Role Descriptions 2027</strong>
                </h1>
                <a
                    href="https://docs.google.com/forms/d/e/1FAIpQLSeWQDcxK7Bd8SRq-gCqC3cbjuu9V2czD6uU8-4ZMS6IfqgrgQ/viewform"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm font-bold text-primroseYellow hover:text-roseRed"
                >
                    Nominate Here: Link to Form
                </a>
            </div>

            <div className="flex flex-wrap justify-center gap-2 mt-2 mb-4 px-2">
                {TABS.map((t) => (
                    <button
                        key={t.key}
                        onClick={() => setActiveTab(t.key)}
                        className={`text-sm font-bold px-4 py-2 rounded-xl ${activeTab === t.key
                                ? 'bg-myrtleGreen text-white'
                                : 'bg-white text-myrtleGreen border border-myrtleGreen'
                            }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            <div className="w-full flex justify-center px-2">
                <div className="w-full md:w-4/5 lg:w-3/5">
                    {activeTab === 'overview' && <OverviewPanel />}
                    {activeTab === 'governance' && <GovernancePanel />}
                    {ROLES[activeTab] && <RolePanel role={ROLES[activeTab]} />}
                </div>
            </div>
        </div>
    );
}
