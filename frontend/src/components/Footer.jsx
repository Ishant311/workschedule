import React, { useState } from 'react';
import Logo from './Logo';

const footerData = [
  {
    title: 'Features',
    items: [
      'Analytics', 'Auto scheduling', 'Break planning compliance', 'Demand forecasting', 'Fair workweek compliance',
      'Integrations', 'Labor law compliance', 'Leave management', 'Mobile app', 'Performance management',
      'Scheduling', 'Shift planning', 'Shift swapping', 'Smart scheduling', 'Task management',
      'Team engagement', 'Time clock app', 'Time tracking', 'Workplace communication'
    ]
  },
  {
    title: 'Product',
    items: ['Pricing', 'Product tour', "See what's new"]
  },
  {
    title: 'Business Size',
    items: ['Enterprise', 'Small or medium-sized']
  },
  {
    title: 'Industries Served',
    items: [
      'All industries', 'Agriculture', 'Call center', 'Charity', 'Cleaning services',
      'Construction & Engineering', 'Education', 'Entertainment', 'Healthcare', 'Hospitality',
      'Hotels & Resorts', 'Manufacturing & Logistics', 'Professional services', 'Retail', 'Security', 'Supermarkets'
    ]
  },
  {
    title: 'HR Software',
    items: ['Deputy HR', 'Hire', 'New Hire Onboarding', 'Document Management']
  },
  {
    title: 'Resources',
    items: ['Blog', 'Compliance Hub', 'Customer stories', 'Customer reviews', 'Deputy insights', 'Deputy reviews', 'Glossary', 'Newsroom', 'Refer a friend', 'Scheduling ROI Calculator']
  },
  {
    title: 'Support',
    items: ['Deputy training', 'Deputy API', 'GDPR', 'Help center', 'Security', 'System status', 'Trust center']
  },
  {
    title: 'Company',
    items: ['About us', 'Careers', 'Partners', 'Press', 'Why Deputy', 'Workforce management']
  }
];

export default function Footer() {
  const [activeSection, setActiveSection] = useState(null);

  const handleToggle = (index) => {
    setActiveSection((prev) => (prev === index ? null : index));
  };

  return (
    <footer className="bg-[#28077b] text-white p-6 mt-15">
      <div className="bg-[#28077b] text-white py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Logo and text */}
            <div className="flex items-center gap-4">
            <Logo color="white" />
            <p className="text-sm sm:text-base leading-tight">
                Improving the world of work,<br />
                one shift at a time
            </p>
            </div>

            {/* App download buttons */}
            <div className="flex gap-3">
            <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/512px-Google_Play_Store_badge_EN.svg.png"
                alt="Google Play"
                className="h-10"
            />
            </div>
        </div>
        </div>
      <div className="max-w-7xl mx-auto">
        {footerData.map((section, index) => (
          <div key={index} className="border-b border-gray-700 py-3 text-orange-400">
            <button
              className="w-full text-left text-sm flex justify-between items-center"
              onClick={() => handleToggle(index)}
            >
              {section.title}
              <span className="text-xl text-gray-400">{activeSection === index ? '-' : '+'}</span>
            </button>
            {activeSection === index && (
              <ul className="mt-2 pl-4 text-sm text-white">
                {section.items.map((item, i) => (
                  <li key={i} className="py-1">{item}</li>
                ))}
              </ul>
            )}
          </div>
        ))}

      </div>
    </footer>
  );
}
