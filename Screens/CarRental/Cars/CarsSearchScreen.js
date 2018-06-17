import React, { Component } from 'react'
import {
  View,
  Button,
  ScrollView,
  KeyboardAvoidingView,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Dimensions
} from 'react-native'
import styles from '../../styles'
import RNPickerSelect from 'react-native-picker-select'
import IosColors from '../../colors'
import { CalendarList } from 'react-native-calendars'
import API from '../../API'

const selectedColor = IosColors.Green

export default class CarsSearchScreen extends Component {
  static navigationOptions = {
    title: 'Search'
  }

  constructor (props) {
    super(props)
    this.state = {
      _selectedDays: {},
      brand: 'none',
      model: 'none',
      color: 'none',
      gearbox: 'none',
      fuelType: 'none',
      drive: 'none',
      yearMin: 'none',
      yearMax: 'none',
      fuelCapMin: 'none',
      fuelCapMax: 'none',
      bootMin: 'none',
      bootMax: 'none',
      rangeMin: 'none',
      rangeMax: 'none',
      doorsMin: 'none',
      doorsMax: 'none',
      gearsMin: 'none',
      gearsMax: 'none',
      dayCostMin: 'none',
      dayCostMax: 'none',

      brands: [
        {
          label: 'Volvo',
          value: 'Volvo'
        },
        {
          label: 'Mazda',
          value: 'Mazda'
        }
      ],
      models: [
        {
          label: 'V40',
          value: 'V40'
        },
        {
          label: 's4',
          value: 's4'
        }
      ],
      colors: [
        {
          label: 'white',
          value: 'white'
        },
        {
          label: 'silver',
          value: 'silver'
        }
      ],
      geraboxes: [
        {
          label: 'autmmatic',
          value: 'A'
        },
        {
          label: 'manual',
          value: 'M'
        }
      ],
      fuelTypes: [
        {
          label: 'diesel',
          value: 'D'
        },
        {
          label: 'petrol',
          value: 'B'
        }
      ],
      drives: [
        {
          label: '2x4',
          value: '2x4'
        },
        {
          label: '4x4',
          value: '4x4'
        }
      ],
      years: [
        {
          label: '2010',
          value: '2010'
        },
        {
          label: '2018',
          value: '2018'
        }
      ],
      fuelcaps: [
        {
          label: '20',
          value: '20'
        },
        {
          label: '50',
          value: '50'
        }
      ],
      boots: [
        {
          label: '60',
          value: '60'
        },
        {
          label: '80',
          value: '80'
        }
      ],
      ranges: [
        {
          label: '350',
          value: '350'
        },
        {
          label: '450',
          value: '450'
        }
      ],
      doors: [
        {
          label: '4',
          value: '4'
        },
        {
          label: '5',
          value: '5'
        }
      ],
      gears: [
        {
          label: '5',
          value: '5'
        },
        {
          label: '6',
          value: '6'
        }
      ],
      dayCosts: [
        {
          label: '29.99',
          value: '29.99'
        },
        {
          label: '44.90',
          value: '44.90'
        }
      ]
    }
    this.inputRefs = {}
  }

  componentDidMount () {
    this._getCarsAsync()
  }

  _getCarsAsync = async () => {
    fetch(API.URL + '/cars', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(response => {
      if (response.status === 200) {
        response.json().then(json => {
          this.setState(
            {
              cars: json.cars
            },
            () => this.setArrays()
          )
        })
      } else {
        console.log('cars getting error')
      }
      this.setState({ refreshing: false })
    })
  }

  setArrays () {
    const cars = this.state.cars
    console.log(cars)
    let brands = []
    let models = []
    let colors = []
    let drives = []
    let years = []
    let fuelcaps = []
    let boots = []
    let ranges = []
    let doors = []
    let gears = []
    let dayCosts = []
    for (let c in cars) {
      brands.push({ value: cars[c].brand, label: cars[c].brand })
      models.push({ value: cars[c].model, label: cars[c].model })
      colors.push({ value: cars[c].color, label: cars[c].color })
      drives.push({ value: cars[c].drive, label: cars[c].drive })
      years.push({
        value: cars[c].yearprod.toString(),
        label: cars[c].yearprod.toString()
      })
      fuelcaps.push({
        value: cars[c].fuelcap.toString(),
        label: cars[c].fuelcap.toString()
      })
      boots.push({
        value: cars[c].boot.toString(),
        label: cars[c].boot.toString()
      })
      ranges.push({
        value: cars[c].range.toString(),
        label: cars[c].range.toString()
      })
      doors.push({
        value: cars[c].doors.toString(),
        label: cars[c].doors.toString()
      })
      gears.push({
        value: cars[c].gears.toString(),
        label: cars[c].gears.toString()
      })
      dayCosts.push({
        value: cars[c].daycost.toString(),
        label: cars[c].daycost.toString()
      })
    }

    this.setState({
      brands: brands,
      models: models,
      colors: colors,
      drives: drives,
      years: years,
      fuelcaps: fuelcaps,
      boots: boots,
      ranges: ranges,
      doors: doors,
      gears: gears,
      dayCosts: dayCosts
    })
  }

  onSelect (value, label) {
    this.setState({ value: value })
  }

  prepareQueryParams = async () => {
    let query = '?'
    const {
      brand,
      model,
      color,
      gearbox,
      fuelType,
      drive,
      yearMin,
      yearMax,
      fuelCapMin,
      fuelCapMax,
      bootMin,
      bootMax,
      rangeMin,
      rangeMax,
      doorsMin,
      doorsMax,
      gearsMin,
      gearsMax,
      dayCostMin,
      dayCostMax
    } = this.state

    if (brand !== 'none') {
      query += 'brand=' + brand + '&'
    }
    if (model !== 'none') {
      query += 'model=' + model + '&'
    }
    if (color !== 'none') {
      query += 'color=' + color + '&'
    }
    if (gearbox !== 'none') {
      query += 'gearbox=' + gearbox + '&'
    }
    if (fuelType !== 'none') {
      query += 'fuelType=' + fuelType + '&'
    }
    if (drive !== 'none') {
      query += 'drive=' + drive + '&'
    }
    if (yearMin !== 'none') {
      query += 'yearMin=' + yearMin + '&'
    }
    if (yearMax !== 'none') {
      query += 'yearMax=' + yearMax + '&'
    }
    if (fuelCapMin !== 'none') {
      query += 'fuelCapMin=' + fuelCapMin + '&'
    }
    if (fuelCapMax !== 'none') {
      query += 'fuelCapMax=' + fuelCapMax + '&'
    }
    if (bootMin !== 'none') {
      query += 'bootMin=' + bootMin + '&'
    }
    if (bootMax !== 'none') {
      query += 'bootMax=' + bootMax + '&'
    }
    if (rangeMin !== 'none') {
      query += 'rangeMin=' + rangeMin + '&'
    }
    if (rangeMax !== 'none') {
      query += 'rangeMax=' + rangeMax + '&'
    }
    if (doorsMin !== 'none') {
      query += 'doorsMin=' + doorsMin + '&'
    }
    if (doorsMax !== 'none') {
      query += 'doorsMax=' + doorsMax + '&'
    }
    if (gearsMin !== 'none') {
      query += 'gearsMin=' + gearsMin + '&'
    }
    if (gearsMax !== 'none') {
      query += 'gearsMax=' + gearsMax + '&'
    }
    if (dayCostMin !== 'none') {
      query += 'dayCostMin=' + dayCostMin + '&'
    }
    if (dayCostMax !== 'none') {
      query += 'dayCostMax=' + dayCostMax + '&'
    }

    const selected = this.state._selectedDays
    const size = Object.keys(selected).length
    const keys = Object.keys(selected)

    let fromDate
    let toDate

    if (size > 0) {
      fromDate = new Date(keys[0])
      toDate = new Date(keys[0])
      if (size === 1) {
        // it is okay one day
      } else {
        for (let i = 1; i < size; i++) {
          let tmpDate = new Date(keys[i])

          if (tmpDate < fromDate) {
            fromDate = tmpDate
          } else if (tmpDate > toDate) {
            toDate = tmpDate
          }
        }
      }

      fromDate = fromDate.toISOString()
      fromDate = fromDate.substring(0, 10)
      toDate = toDate.toISOString()
      toDate = toDate.substring(0, 10)
      query += 'fromDate=' + fromDate + '&toDate=' + toDate
    }
    console.log(query)
    this.props.navigation.state.params.CarsScreen._getCarsAsync(query)
    this.props.navigation.goBack()
  }

  onDayPress = day => {
    let _selectedDay = day.dateString

    let now = new Date()
    let selectedDate = new Date(_selectedDay)
    if (selectedDate > now) {
      let choosedDay = this.state._selectedDays[_selectedDay]

      if (choosedDay === undefined || choosedDay.color === undefined) {
        console.log('free')
        const updatedSelectedDays = {
          ...this.state._selectedDays,
          ...{
            [_selectedDay]: {
              color: selectedColor,
              startingDay: true,
              endingDay: true
            }
          }
        }
        this.setState({ _selectedDays: updatedSelectedDays }, () =>
          console.log(this.state._selectedDays)
        )
      } else {
        console.log('choosed')
        let dates = this.state._selectedDays
        delete dates[_selectedDay]

        const updatedSelectedDays = { ...dates }
        this.setState({ _selectedDays: updatedSelectedDays }, () =>
          console.log(this.state._selectedDays)
        )
      }
    } else {
      Alert.alert(
        'This day is unavailable.',
        'Select future day.',
        [{ text: 'OK' }],
        {
          cancelable: false
        }
      )
    }
  }

  render () {
    const marked = { ...this.state._reservedDays, ...this.state._selectedDays }
    const { width } = Dimensions.get('window')
    return (
      <ScrollView>
        {/* brand model */}
        <View style={styles.miniRow}>
          <View style={styles.miniColumn}>
            <RNPickerSelect
              placeholder={{
                label: 'Select brand',
                value: 'none'
              }}
              items={this.state.brands}
              onValueChange={value => {
                this.setState({
                  brand: value
                })
              }}
              style={{ ...pickerSelectStyles }}
            />
          </View>
          <View style={styles.miniColumn}>
            <RNPickerSelect
              placeholder={{
                label: 'Select model',
                value: 'none'
              }}
              items={this.state.models}
              onValueChange={value => {
                this.setState({
                  model: value
                })
              }}
              style={{ ...pickerSelectStyles }}
            />
          </View>
        </View>
        {/* color, gerabox */}
        <View style={styles.miniRow}>
          <View style={styles.miniColumn}>
            <RNPickerSelect
              placeholder={{
                label: 'Select color',
                value: 'none'
              }}
              items={this.state.colors}
              onValueChange={value => {
                this.setState({
                  color: value
                })
              }}
              style={{ ...pickerSelectStyles }}
            />
          </View>
          <View style={styles.miniColumn}>
            <RNPickerSelect
              placeholder={{
                label: 'Select gearbox',
                value: 'none'
              }}
              items={this.state.geraboxes}
              onValueChange={value => {
                this.setState({
                  gearbox: value
                })
              }}
              style={{ ...pickerSelectStyles }}
            />
          </View>
        </View>
        {/* fueltypes, drive */}
        <View style={styles.miniRow}>
          <View style={styles.miniColumn}>
            <RNPickerSelect
              placeholder={{
                label: 'Select fuel type',
                value: 'none'
              }}
              items={this.state.fuelTypes}
              onValueChange={value => {
                this.setState({
                  fuelType: value
                })
              }}
              style={{ ...pickerSelectStyles }}
            />
          </View>
          <View style={styles.miniColumn}>
            <RNPickerSelect
              placeholder={{
                label: 'Select drive type',
                value: 'none'
              }}
              items={this.state.drives}
              onValueChange={value => {
                this.setState({
                  drive: value
                })
              }}
              style={{ ...pickerSelectStyles }}
            />
          </View>
        </View>
        {/* yearMin, yearMax */}
        <View style={styles.miniRow}>
          <View style={styles.miniColumn}>
            <RNPickerSelect
              placeholder={{
                label: 'Select min year',
                value: 'none'
              }}
              items={this.state.years}
              onValueChange={value => {
                this.setState({
                  yearMin: value
                })
              }}
              style={{ ...pickerSelectStyles }}
            />
          </View>
          <View style={styles.miniColumn}>
            <RNPickerSelect
              placeholder={{
                label: 'Select max year',
                value: 'none'
              }}
              items={this.state.years}
              onValueChange={value => {
                this.setState({
                  yearMax: value
                })
              }}
              style={{ ...pickerSelectStyles }}
            />
          </View>
        </View>
        {/* fuelcapMin, fuelcapMax */}
        <View style={styles.miniRow}>
          <View style={styles.miniColumn}>
            <RNPickerSelect
              placeholder={{
                label: 'Select min fuel cap',
                value: 'none'
              }}
              items={this.state.fuelcaps}
              onValueChange={value => {
                this.setState({
                  fuelCapMin: value
                })
              }}
              style={{ ...pickerSelectStyles }}
            />
          </View>
          <View style={styles.miniColumn}>
            <RNPickerSelect
              placeholder={{
                label: 'Select max fuel cap',
                value: 'none'
              }}
              items={this.state.fuelcaps}
              onValueChange={value => {
                this.setState({
                  fuelCapMax: value
                })
              }}
              style={{ ...pickerSelectStyles }}
            />
          </View>
        </View>
        {/* bootMin, bootMax */}
        <View style={styles.miniRow}>
          <View style={styles.miniColumn}>
            <RNPickerSelect
              placeholder={{
                label: 'Select min boot size',
                value: 'none'
              }}
              items={this.state.boots}
              onValueChange={value => {
                this.setState({
                  bootMin: value
                })
              }}
              style={{ ...pickerSelectStyles }}
            />
          </View>
          <View style={styles.miniColumn}>
            <RNPickerSelect
              placeholder={{
                label: 'Select max boot size',
                value: 'none'
              }}
              items={this.state.boots}
              onValueChange={value => {
                this.setState({
                  bootMax: value
                })
              }}
              style={{ ...pickerSelectStyles }}
            />
          </View>
        </View>
        {/* rangeMin, rangeMax */}
        <View style={styles.miniRow}>
          <View style={styles.miniColumn}>
            <RNPickerSelect
              placeholder={{
                label: 'Select min range',
                value: 'none'
              }}
              items={this.state.ranges}
              onValueChange={value => {
                this.setState({
                  rangeMin: value
                })
              }}
              style={{ ...pickerSelectStyles }}
            />
          </View>
          <View style={styles.miniColumn}>
            <RNPickerSelect
              placeholder={{
                label: 'Select max range',
                value: 'none'
              }}
              items={this.state.ranges}
              onValueChange={value => {
                this.setState({
                  rangeMax: value
                })
              }}
              style={{ ...pickerSelectStyles }}
            />
          </View>
        </View>
        {/* doorsMin, doorsMax */}
        <View style={styles.miniRow}>
          <View style={styles.miniColumn}>
            <RNPickerSelect
              placeholder={{
                label: 'Select min doors',
                value: 'none'
              }}
              items={this.state.doors}
              onValueChange={value => {
                this.setState({
                  doorsMin: value
                })
              }}
              style={{ ...pickerSelectStyles }}
            />
          </View>
          <View style={styles.miniColumn}>
            <RNPickerSelect
              placeholder={{
                label: 'Select max doors',
                value: 'none'
              }}
              items={this.state.doors}
              onValueChange={value => {
                this.setState({
                  doorsMax: value
                })
              }}
              style={{ ...pickerSelectStyles }}
            />
          </View>
        </View>
        {/* gearsMin, gearsMax */}
        <View style={styles.miniRow}>
          <View style={styles.miniColumn}>
            <RNPickerSelect
              placeholder={{
                label: 'Select min gears',
                value: 'none'
              }}
              items={this.state.gears}
              onValueChange={value => {
                this.setState({
                  gearsMin: value
                })
              }}
              style={{ ...pickerSelectStyles }}
            />
          </View>
          <View style={styles.miniColumn}>
            <RNPickerSelect
              placeholder={{
                label: 'Select max gears',
                value: 'none'
              }}
              items={this.state.gears}
              onValueChange={value => {
                this.setState({
                  gearsMax: value
                })
              }}
              style={{ ...pickerSelectStyles }}
            />
          </View>
        </View>
        {/* dayCostMin, dayCostMax */}
        <View style={styles.miniRow}>
          <View style={styles.miniColumn}>
            <RNPickerSelect
              placeholder={{
                label: 'Min day cost',
                value: 'none'
              }}
              items={this.state.dayCosts}
              onValueChange={value => {
                this.setState({
                  dayCostMin: value
                })
              }}
              style={{ ...pickerSelectStyles }}
            />
          </View>
          <View style={styles.miniColumn}>
            <RNPickerSelect
              placeholder={{
                label: 'Max day cost',
                value: 'none'
              }}
              items={this.state.dayCosts}
              onValueChange={value => {
                this.setState({
                  dayCostMax: value
                })
              }}
              style={{ ...pickerSelectStyles }}
            />
          </View>
        </View>
        <View
          style={{
            marginBottom: 8
          }}
        >
          <Text style={styles.listTitle}>Choose days:</Text>
          <CalendarList
            horizontal
            calendarWidth={width}
            firstDay={1}
            scrollEnabled
            pastScrollRange={0}
            pagingEnabled
            markedDates={marked}
            onDayPress={this.onDayPress}
            markingType='period'
            theme={{
              todayTextColor: '#00adf5'
            }}
          />
        </View>
        <Button
          title='Search'
          onPress={() => {
            this.prepareQueryParams()
          }}
        />

      </ScrollView>
    )
  }
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 14,
    paddingTop: 13,
    paddingHorizontal: 8,
    paddingBottom: 12,
    borderWidth: 1,
    borderColor: IosColors.LightGray,
    borderRadius: 4,
    backgroundColor: 'white',
    color: 'black'
  }
})
