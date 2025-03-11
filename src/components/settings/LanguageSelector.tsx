
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/context/LanguageContext';
import { toast } from 'sonner';

const LanguageSelector: React.FC = () => {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = React.useState(currentLanguage);

  const handleLanguageChange = (language: 'en' | 'cs') => {
    setSelectedLanguage(language);
  };

  const handleSave = () => {
    changeLanguage(selectedLanguage);
    toast.success(t('common.save'));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('settings.language')}</CardTitle>
        <CardDescription>
          {t('settings.languageSettings')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup 
          value={selectedLanguage} 
          onValueChange={(value) => handleLanguageChange(value as 'en' | 'cs')}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="en" id="english" />
            <Label htmlFor="english">{t('settings.english')}</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="cs" id="czech" />
            <Label htmlFor="czech">{t('settings.czech')}</Label>
          </div>
        </RadioGroup>
        
        <Button onClick={handleSave}>{t('common.save')}</Button>
      </CardContent>
    </Card>
  );
};

export default LanguageSelector;
