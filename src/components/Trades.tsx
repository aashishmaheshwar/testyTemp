import { Box, Button } from '@material-ui/core';
import React from 'react';
import '../css/Trades.css';

const Trades = () => {
    return (
        <>
          <Box>
              <Button color="primary">+ New Trade</Button>
          </Box>  
          <Box>
              <table>
                  <thead>
                      <tr>
                          <td>
                              Trade ID
                          </td>
                          <td>Trade Model Name</td>
                          <td>Trade Channel Name</td>
                          <td>Show Trade Model</td>
                      </tr>
                  </thead>
                  <tbody>
                      <tr>
                          <td>TM000027</td> 
                          <td>XP Investimentos - Equity</td> 
                          <td>XP Investimentos - Fix</td> 
                          <td><Button color="primary">Show/Edit Trade Details</Button></td>
                      </tr>
                  </tbody>
              </table>
          </Box>
        </>
    )
}

export default Trades
