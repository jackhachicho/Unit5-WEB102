import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Container,
  Select,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  useColorModeValue,
} from '@chakra-ui/react';
import { SunIcon, MoonIcon, SearchIcon } from '@chakra-ui/icons';

const WeatherDash = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [searchDate, setSearchDate] = useState('');
  const [tempFilter, setTempFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');

  useEffect(() => {
    // Generate 20 days of simulated weather data
    const generateWeatherData = () => {
      const data = [];
      const conditions = ['Clear', 'Partly Cloudy', 'Cloudy', 'Rain', 'Thunderstorm', 'Foggy'];
      const baseDate = new Date('2024-10-22');
      
      for (let i = 0; i < 20; i++) {
        const date = new Date(baseDate);
        date.setDate(baseDate.getDate() + i);
        
        // Generate realistic temperature patterns
        const baseTemp = 65 + Math.sin(i * 0.5) * 10; // Creates a wave pattern
        const highTemp = baseTemp + Math.random() * 5;
        const lowTemp = baseTemp - Math.random() * 5;
        
        // Generate realistic sunrise/sunset times with slight daily variations
        const baseTime = new Date(date);
        baseTime.setHours(6, 15, 0);
        const sunriseVariation = Math.floor(Math.random() * 10);
        baseTime.setMinutes(baseTime.getMinutes() + sunriseVariation);
        const sunrise = baseTime.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        });
        
        const sunsetBase = new Date(date);
        sunsetBase.setHours(19, 0, 0);
        const sunsetVariation = Math.floor(Math.random() * 10);
        sunsetBase.setMinutes(sunsetBase.getMinutes() + sunsetVariation);
        const sunset = sunsetBase.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        });

        data.push({
          date: date.toISOString().split('T')[0],
          temp: baseTemp.toFixed(1),
          high_temp: highTemp.toFixed(1),
          low_temp: lowTemp.toFixed(1),
          sunrise,
          sunset,
          conditions: conditions[Math.floor(Math.random() * conditions.length)]
        });
      }
      return data;
    };

    setWeatherData(generateWeatherData());
  }, []);

  // Calculate statistics
  const avgTemp = weatherData.length > 0 
    ? weatherData.reduce((acc, curr) => acc + parseFloat(curr.temp), 0) / weatherData.length 
    : 0;
  const maxTemp = weatherData.length > 0 
    ? Math.max(...weatherData.map(d => parseFloat(d.high_temp)))
    : 0;
  const minTemp = weatherData.length > 0 
    ? Math.min(...weatherData.map(d => parseFloat(d.low_temp)))
    : 0;

  // Filter functions
  const filteredData = weatherData.filter(data => {
    const matchesSearch = data.date.toLowerCase().includes(searchDate.toLowerCase());
    const matchesTemp = tempFilter === 'all' ? true :
      tempFilter === 'high' ? parseFloat(data.temp) > 60 :
      tempFilter === 'low' ? parseFloat(data.temp) <= 60 : true;
    const matchesTime = timeFilter === 'all' ? true :
      timeFilter === 'morning' ? data.sunrise < '07:00' :
      timeFilter === 'evening' ? data.sunset > '19:00' : true;
    
    return matchesSearch && matchesTemp && matchesTime;
  });

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  return (
    <Container maxW="container.xl" p={5}>
      <VStack spacing={8} w="full">
        {/* Header */}
        <Box w="full" p={5} bg={cardBg} rounded="lg" shadow="md">
          <Heading size="lg">WeatherDash - San Francisco, CA</Heading>
        </Box>

        {/* Stats Cards */}
        <StatGroup w="full" gap={4}>
          <Stat bg={cardBg} p={5} rounded="lg" shadow="md">
            <StatLabel>Average Temperature</StatLabel>
            <StatNumber>{avgTemp.toFixed(1)}°F</StatNumber>
          </Stat>
          <Stat bg={cardBg} p={5} rounded="lg" shadow="md">
            <StatLabel>Highest Temperature</StatLabel>
            <StatNumber>{maxTemp.toFixed(1)}°F</StatNumber>
          </Stat>
          <Stat bg={cardBg} p={5} rounded="lg" shadow="md">
            <StatLabel>Lowest Temperature</StatLabel>
            <StatNumber>{minTemp.toFixed(1)}°F</StatNumber>
          </Stat>
        </StatGroup>

        {/* Search and Filters */}
        <HStack w="full" spacing={4}>
          <Input
            placeholder="Search by date (YYYY-MM-DD)"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
          />
          <Select value={tempFilter} onChange={(e) => setTempFilter(e.target.value)}>
            <option value="all">All Temperatures</option>
            <option value="high">Above 60°F</option>
            <option value="low">Below 60°F</option>
          </Select>
          <Select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)}>
            <option value="all">All Times</option>
            <option value="morning">Early Sunrise</option>
            <option value="evening">Late Sunset</option>
          </Select>
        </HStack>

        {/* Data Table */}
        <Box w="full" overflowX="auto" bg={cardBg} rounded="lg" shadow="md">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Date</Th>
                <Th>Temperature</Th>
                <Th>High</Th>
                <Th>Low</Th>
                <Th>Sunrise</Th>
                <Th>Sunset</Th>
                <Th>Conditions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredData.map((data, index) => (
                <Tr key={index}>
                  <Td>{data.date}</Td>
                  <Td>{data.temp}°F</Td>
                  <Td>{data.high_temp}°F</Td>
                  <Td>{data.low_temp}°F</Td>
                  <Td>{data.sunrise}</Td>
                  <Td>{data.sunset}</Td>
                  <Td>{data.conditions}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </VStack>
    </Container>
  );
};

export default WeatherDash;