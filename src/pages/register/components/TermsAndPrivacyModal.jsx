import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TermsAndPrivacyModal = ({ isOpen, onClose, type }) => {
  if (!isOpen) return null;

  const termsContent = `
    **Terms of Service**
    
    **1. Acceptance of Terms**
    By accessing and using Job Matrimony, you accept and agree to be bound by the terms and provision of this agreement.
    
    **2. Use License**
    Permission is granted to temporarily download one copy of Job Matrimony materials for personal, non-commercial transitory viewing only.
    
    **3. User Accounts**
    - You are responsible for safeguarding your account credentials
    - You must provide accurate and complete information during registration
    - You are responsible for all activities that occur under your account
    
    **4. Prohibited Uses**
    You may not use our service:
    - For any unlawful purpose or to solicit others to perform unlawful acts
    - To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances
    - To infringe upon or violate our intellectual property rights or the intellectual property rights of others
    
    **5. Content Submission**
    - You retain ownership of content you submit
    - You grant us a license to use, modify, and display your content
    - You are responsible for the accuracy of your submitted content
    
    **6. Privacy and Data Protection**
    Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service.
    
    **7. Termination**
    We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability.
    
    **8. Disclaimer**
    The information on this website is provided on an "as is" basis. To the fullest extent permitted by law, this Company excludes all representations, warranties, conditions and terms.
    
    **9. Limitation of Liability**
    In no event shall Job Matrimony, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, punitive, special, or consequential damages.
    
    **10. Governing Law**
    These terms and conditions are governed by and construed in accordance with the laws of the United States.
  `;

  const privacyContent = `
    **Privacy Policy**
    
    **1. Information We Collect**
    We collect information you provide directly to us, such as when you create an account, fill out a form, or contact us.
    
    **Personal Information:**
    - Name, email address, phone number
    - Professional information (resume, work experience, skills)
    - Company information (for recruiters)
    
    **Automatically Collected Information:**
    - Device information, IP address, browser type
    - Usage data and analytics
    - Cookies and similar tracking technologies
    
    **2. How We Use Your Information**
    - To provide, maintain, and improve our services
    - To process transactions and send related information
    - To send technical notices, updates, security alerts
    - To respond to your comments, questions, and requests
    - To communicate with you about products, services, and events
    
    **3. Information Sharing**
    We do not sell, trade, or otherwise transfer your personal information to third parties except:
    - With your consent
    - To service providers who assist us in operating our website
    - To comply with legal obligations
    - To protect our rights and safety
    
    **4. Data Security**
    We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
    
    **5. Data Retention**
    We retain your information for as long as your account is active or as needed to provide you services, comply with legal obligations, resolve disputes, and enforce agreements.
    
    **6. Your Rights**
    You have the right to:
    - Access your personal information
    - Correct inaccurate information
    - Delete your account and personal information
    - Object to processing of your information
    - Data portability
    
    **7. Cookies**
    We use cookies to enhance your experience, analyze site usage, and assist in our marketing efforts. You can control cookie settings through your browser.
    
    **8. Third-Party Links**
    Our service may contain links to third-party websites. We are not responsible for the privacy practices of these external sites.
    
    **9. Children's Privacy**
    Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13.
    
    **10. Changes to Privacy Policy**
    We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.
    
    **11. Contact Information**
    If you have questions about this Privacy Policy, please contact us at privacy@jobmatrimony.com.
  `;

  const content = type === 'terms' ? termsContent : privacyContent;
  const title = type === 'terms' ? 'Terms of Service' : 'Privacy Policy';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-modal flex items-center justify-center p-4">
      <div className="bg-surface rounded-lg shadow-elevation-5 max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-light">
          <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
          <Button
            variant="ghost"
            onClick={onClose}
            className="p-2"
            aria-label="Close modal"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="prose prose-sm max-w-none">
            {content.split('\n').map((paragraph, index) => {
              if (paragraph.trim() === '') return null;
              
              if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                const text = paragraph.slice(2, -2);
                return (
                  <h3 key={index} className="text-lg font-semibold text-text-primary mt-6 mb-3 first:mt-0">
                    {text}
                  </h3>
                );
              }
              
              return (
                <p key={index} className="text-sm text-text-secondary mb-3 leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border-light">
          <div className="flex justify-end">
            <Button variant="primary" onClick={onClose}>
              I Understand
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndPrivacyModal;