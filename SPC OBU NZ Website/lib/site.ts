export const site = {
  name: "SPC OBU New Zealand",
  shortName: "SPC OBU NZ",
  motto: "Virtus et Veritas",
  established: 2020,
  email: "spcobunz@gmail.com",
  facebook: "https://www.facebook.com/spcobunz",
  instagram: "https://www.instagram.com/spcobunz",
  joePeteUrl: "https://openflowfun.github.io/BattleOfSaintsNZ/",
};

export const nav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Committee", href: "/committee" },
  { label: "Events", href: "/events" },
  { label: "Joe-Pete NZ", href: "/joe-pete" },
  { label: "Membership", href: "/membership" },
  { label: "Sponsors", href: "/sponsors" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

export const gala = {
  title: "SPC OBU NZ Gala Dinner Dance",
  dateLabel: "Saturday, 3rd October 2026",
  dateISO: "2026-10-03T19:00:00+13:00",
  venue: "Fairway Events Centre, Auckland",
  price: 110,
  tablePrice: 1100,
};

export type Member = { role: string; name: string; note?: string };

export const committee: { tier: string; members: Member[] }[] = [
  {
    tier: "Patron",
    members: [
      {
        role: "Patron",
        name: "Rev. Fr. Rohitha Rodrigo",
        note: "Rector of St Peter's College, Colombo 04",
      },
    ],
  },
  {
    tier: "Vice Patrons",
    members: [
      { role: "Vice Patron", name: "Dale Rabot" },
      { role: "Vice Patron", name: "Sriyan Senadheera" },
      { role: "Vice Patron", name: "Asoka Attapattu", note: "Current SL OBU President" },
    ],
  },
  {
    tier: "Executive",
    members: [
      { role: "President", name: "Shohan Wimalaratne" },
      { role: "Past President", name: "Malik Lenora" },
      { role: "Vice President", name: "Kevin Alexander" },
      { role: "Vice President", name: "Dr Shahane De Costa" },
      { role: "Vice President", name: "Dinuka Silva" },
    ],
  },
  {
    tier: "Office Bearers",
    members: [
      { role: "Secretary", name: "Herschelle Hendricks" },
      { role: "Assistant Secretary", name: "Collin Francke" },
      { role: "Treasurer", name: "Navin Fonseka" },
      { role: "Assistant Treasurer", name: "Vacant" },
      { role: "Social Secretary", name: "Kanishka Perera" },
      { role: "Assistant Social Secretary", name: "Ulyssess David" },
      { role: "Media Secretary", name: "Prasad De Silva" },
      { role: "Assistant Media Secretary", name: "Pradeep De Silva" },
      { role: "Sports Secretary", name: "Shevon Perera" },
      { role: "Assistant Sports Secretary", name: "Lahiru Manawadu" },
    ],
  },
  {
    tier: "General Committee",
    members: [
      "Ravi Dharmawardane",
      "Chandana Lorden",
      "Thilina Perera",
      "Dinesh Fernando",
      "Warren Hendricks",
      "Rajan Jayathunga",
      "Warren Pietersz",
      "Madushan Rathnasekara",
      "Shanil Silva",
      "Harindra Wijesena",
      "Mohan Herath",
    ].map((name) => ({ role: "General Committee", name })),
  },
];
