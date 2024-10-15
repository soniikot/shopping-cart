import { FC, useState } from 'react';
import style from './styles.module.scss';
import { Tab, Box } from '@mui/material';
import { TabPanel, TabContext, TabList } from '@mui/lab';
import product_table from '@assets/product_table.png';

export const ProductTabs: FC = () => {
  const [value, setValue] = useState('1');

  //error on change Bottom description line 22

  const handleTabChange = (event: MouseEvent, newValue: string) => {
    setValue(newValue);
  };
  return (
    <>
      <div className={style.wrapper}></div>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1 }}>
          <TabList
            onChange={handleTabChange}
            textColor="secondary"
            indicatorColor="secondary"
          >
            <Tab label="Description" value="1" />
            <Tab label="User comments" value="2" />
            <Tab label="Question & Answer" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1" sx={{ width: 610, height: 350, overflowY: 'auto' }}>
          100% Bio-washed Cotton - makes the fabric extra soft & silky. Flexible
          ribbed crew neck. Precisely stitched with no pilling & no fading.
          Provide all-time comfort. Anytime, anywhere. Infinite range of
          matte-finish HD prints.
          <br />
          <br />
          <img src={product_table} alt="product_description" />
        </TabPanel>
        <TabPanel value="2" sx={{ width: 610, height: 350, overflowY: 'auto' }}>
          This is nice product
        </TabPanel>
        <TabPanel value="3" sx={{ width: 610, height: 350, overflowY: 'auto' }}>
          You can wash it with everything
        </TabPanel>
      </TabContext>
    </>
  );
};
