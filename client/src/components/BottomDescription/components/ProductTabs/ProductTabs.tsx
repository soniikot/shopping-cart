import { FC, useState } from 'react';
import { type SyntheticEvent } from 'react';
import style from './styles.module.scss';
import { Tab, Box } from '@mui/material';
import { TabPanel, TabContext, TabList } from '@mui/lab';
import product_table from '@assets/product_table.png';

export const ProductTabs: FC = () => {
  const [value, setValue] = useState('1');
  const handleTabChange = (_event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <>
      <div className={style.wrapper}></div>
      <TabContext value={value}>
        <Box
          sx={{
            borderBottom: 1,

            fontSize: {
              xs: '10px',
              sm: '16px',
            },
          }}
        >
          <TabList
            onChange={handleTabChange}
            textColor="secondary"
            indicatorColor="secondary"
          >
            <Tab
              sx={{
                width: {
                  xs: 100,
                  sm: 200,
                },
                fontSize: {
                  xs: '10px',
                  sm: '16px',
                },
              }}
              label="Description"
              value="1"
            />
            <Tab
              sx={{
                width: {
                  xs: 100,
                  sm: 200,
                },
                fontSize: {
                  xs: '10px',
                  sm: '16px',
                },
              }}
              label="User comments"
              value="2"
            />
            <Tab
              sx={{
                width: {
                  xs: 100,
                  sm: 200,
                },
                fontSize: {
                  xs: '10px',
                  sm: '16px',
                },
              }}
              label="Question & Answer"
              value="3"
            />
          </TabList>
        </Box>
        <TabPanel
          value="1"
          sx={{
            width: {
              xs: 300, // 100% width on extra small screens
              sm: 610, // 610px width on small screens and up
            },
            height: 350,
            overflowY: 'auto',
          }}
        >
          100% Bio-washed Cotton - makes the fabric extra soft & silky. Flexible
          ribbed crew neck. Precisely stitched with no pilling & no fading.
          Provide all-time comfort. Anytime, anywhere. Infinite range of
          matte-finish HD prints.
          <br />
          <br />
          <img
            className={style.product_table}
            src={product_table}
            alt="product_description"
          />
        </TabPanel>
        <TabPanel
          value="2"
          sx={{
            width: {
              xs: 300, // 100% width on extra small screens
              sm: 610, // 610px width on small screens and up
            },
            height: 350,
            overflowY: 'auto',
          }}
        >
          This is nice product
        </TabPanel>
        <TabPanel
          value="3"
          sx={{
            width: {
              xs: 300, // 100% width on extra small screens
              sm: 610, // 610px width on small screens and up
            },
            height: 350,
            overflowY: 'auto',
          }}
        >
          You can wash it with everything
        </TabPanel>
      </TabContext>
    </>
  );
};
