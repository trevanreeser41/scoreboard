import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Team } from './Team';
import ScoreboardTable from './ScoreboardTable.js';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `nav-tab-${index}`,
    'aria-controls': `nav-tabpanel-${index}`,
  };
}

function LinkTab(props) {
  return (
    <Tab
      component="a"
      onClick={(event) => {
        event.preventDefault();
      }}
      {...props}
    />
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function NavTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs
          variant="fullWidth"
          value={value}
          onChange={handleChange}
          aria-label="nav tabs example"
        >
          <LinkTab label="Personal Scoreboard" to="/" {...a11yProps(0)} />
          <LinkTab label="College Football" to="/CollegeFootball" {...a11yProps(1)} />
          <LinkTab label="College Basketball" to="/CollegeBasketball" {...a11yProps(2)} />
          <LinkTab label="NBA" to="/NBA" {...a11yProps(3)} />
          <LinkTab label="MLB" to="/MLB" {...a11yProps(4)} />
          <LinkTab label="NFL" to="/NFL" {...a11yProps(5)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
         <Team />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ScoreboardTable sport="basketball" league="nba"/>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <ScoreboardTable sport="basketball" league="mens-college-basketball" />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <ScoreboardTable sport="basketball" league="nba"/>
      </TabPanel>
      <TabPanel value={value} index={4}>
        <ScoreboardTable sport="baseball" league="mlb"/>
      </TabPanel>
      <TabPanel value={value} index={5}>
       <ScoreboardTable sport="football" league="nfl"/>
      </TabPanel>
    </div>
  );
}